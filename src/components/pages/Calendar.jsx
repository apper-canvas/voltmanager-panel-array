import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import EmptyState from '@/components/organisms/EmptyState';
import ApperIcon from '@/components/ApperIcon';
import { repairOrderService } from '@/services';
import technicianService from '@/services/api/technicianService';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [technicians, setTechnicians] = useState([]);
  const [repairOrders, setRepairOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('week');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [techsResult, ordersResult] = await Promise.all([
          technicianService.getAll(),
          repairOrderService.getAll()
        ]);
        
        setTechnicians(techsResult);
        setRepairOrders(ordersResult);
      } catch (err) {
        setError(err.message || 'Failed to load calendar data');
        toast.error('Failed to load calendar data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getWeekDays = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const getOrdersForTechnicianAndDay = (technicianId, day) => {
    return repairOrders.filter(order => 
      order.assignedTechnician === technicianId &&
      order.scheduledDate &&
      isSameDay(parseISO(order.scheduledDate), day)
    );
  };

  const getUnassignedOrders = () => {
    return repairOrders.filter(order => !order.assignedTechnician);
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) return;

    try {
      const orderId = draggableId.replace('order-', '');
      
      if (destination.droppableId === 'unassigned') {
        await repairOrderService.update(orderId, { 
          assignedTechnician: null,
          scheduledDate: null 
        });
        toast.success('Order unassigned');
      } else {
        const [techId, dayIndex] = destination.droppableId.split('-');
        const weekDays = getWeekDays();
        const scheduledDate = weekDays[parseInt(dayIndex)].toISOString();
        
        await repairOrderService.assignTechnician(orderId, techId);
        await repairOrderService.update(orderId, { scheduledDate });
        toast.success('Order assigned successfully');
      }

      // Reload data
      const ordersResult = await repairOrderService.getAll();
      setRepairOrders(ordersResult);
    } catch (err) {
      toast.error('Failed to update assignment');
    }
  };

  const updateTimeSpent = async (orderId, timeSpent) => {
    try {
      await repairOrderService.updateTimeSpent(orderId, timeSpent);
      const ordersResult = await repairOrderService.getAll();
      setRepairOrders(ordersResult);
      toast.success('Time updated successfully');
    } catch (err) {
      toast.error('Failed to update time');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'in-progress':
        return 'bg-info/10 text-info border-info/20';
      case 'completed':
        return 'bg-success/10 text-success border-success/20';
      default:
        return 'bg-surface-100 text-surface-600 border-surface-200';
    }
  };

  const getTechnicianStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-success';
      case 'busy':
        return 'bg-warning';
      case 'offline':
        return 'bg-surface-400';
      default:
        return 'bg-surface-400';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-heading font-bold text-surface-900">Calendar</h1>
          <p className="text-surface-600">Technician schedules and job assignments</p>
        </div>
        <SkeletonLoader count={5} type="table" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState 
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const weekDays = getWeekDays();

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-surface-900">Calendar</h1>
            <p className="text-surface-600">Technician schedules and job assignments</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-1 bg-surface-100 p-1 rounded-lg">
              <button
                onClick={() => setView('week')}
                className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                  view === 'week' 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-surface-600 hover:text-surface-900'
                }`}
              >
                Week
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="ghost"
                icon="ChevronLeft"
                onClick={() => setCurrentDate(prev => addDays(prev, -7))}
              />
              <span className="text-sm font-medium text-surface-900 min-w-[120px] text-center">
                {format(weekDays[0], 'MMM dd')} - {format(weekDays[6], 'MMM dd, yyyy')}
              </span>
              <Button
                size="sm"
                variant="ghost"
                icon="ChevronRight"
                onClick={() => setCurrentDate(prev => addDays(prev, 7))}
              />
            </div>
          </div>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Unassigned Orders */}
          <div className="lg:col-span-1">
            <Card className="p-4 h-fit">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-surface-900">Unassigned Orders</h3>
                <span className="px-2 py-1 bg-surface-100 text-surface-600 rounded text-sm">
                  {getUnassignedOrders().length}
                </span>
              </div>
              
              <Droppable droppableId="unassigned">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-2 min-h-[200px] ${
                      snapshot.isDraggingOver ? 'bg-surface-50 rounded-lg' : ''
                    }`}
                  >
                    {getUnassignedOrders().length === 0 ? (
                      <EmptyState
                        title="No unassigned orders"
                        description="All orders are assigned to technicians"
                        icon="CheckCircle"
                      />
                    ) : (
                      getUnassignedOrders().map((order, index) => (
                        <Draggable key={order.id} draggableId={`order-${order.id}`} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-3 bg-white border border-surface-200 rounded-lg cursor-move transition-shadow ${
                                snapshot.isDragging ? 'shadow-lg' : 'hover:shadow-sm'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-surface-900">
                                  #{order.id}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-xs border ${getStatusColor(order.status)}`}>
                                  {order.status}
                                </span>
                              </div>
                              <p className="text-sm text-surface-700 mb-1">{order.customerName}</p>
                              <p className="text-xs text-surface-500 truncate">{order.deviceInfo}</p>
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </Card>
          </div>

          {/* Calendar Grid */}
          <div className="lg:col-span-3">
            <Card className="p-4">
              <div className="grid grid-cols-7 gap-4">
                {/* Day Headers */}
                {weekDays.map((day, index) => (
                  <div key={index} className="text-center">
                    <div className="text-sm font-medium text-surface-900 mb-1">
                      {format(day, 'EEE')}
                    </div>
                    <div className="text-lg font-semibold text-surface-700">
                      {format(day, 'dd')}
                    </div>
                  </div>
                ))}

                {/* Technician Rows */}
                {technicians.map((technician) => (
                  <div key={technician.id} className="col-span-7 border-t border-surface-200 pt-4 mt-4">
                    <div className="flex items-center mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <ApperIcon name="User" className="w-4 h-4 text-primary" />
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getTechnicianStatusColor(technician.status)}`} />
                        </div>
                        <div>
                          <h4 className="font-medium text-surface-900">{technician.name}</h4>
                          <p className="text-xs text-surface-500">{technician.skills.slice(0, 2).join(', ')}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-4">
                      {weekDays.map((day, dayIndex) => (
                        <Droppable key={`${technician.id}-${dayIndex}`} droppableId={`${technician.id}-${dayIndex}`}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`min-h-[120px] p-2 border border-surface-200 rounded-lg transition-colors ${
                                snapshot.isDraggingOver ? 'bg-primary/5 border-primary/20' : 'bg-surface-50'
                              }`}
                            >
                              <div className="space-y-2">
                                {getOrdersForTechnicianAndDay(technician.id, day).map((order, index) => (
                                  <div key={order.id} className="p-2 bg-white border border-surface-200 rounded text-xs">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="font-medium">#{order.id}</span>
                                      <span className={`px-1 py-0.5 rounded text-xs ${getStatusColor(order.status)}`}>
                                        {order.status}
                                      </span>
                                    </div>
                                    <p className="text-surface-700 mb-1">{order.customerName}</p>
                                    <div className="flex items-center justify-between">
                                      <span className="text-surface-500">
                                        {order.timeSpent ? `${order.timeSpent}h` : '0h'}
                                      </span>
                                      <input
                                        type="number"
                                        step="0.5"
                                        min="0"
                                        value={order.timeSpent || 0}
                                        onChange={(e) => updateTimeSpent(order.id, parseFloat(e.target.value))}
                                        className="w-12 px-1 py-0.5 text-xs border border-surface-300 rounded"
                                        placeholder="0"
                                      />
                                    </div>
                                  </div>
                                ))}
                                {provided.placeholder}
                              </div>
                            </div>
                          )}
                        </Droppable>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default Calendar;