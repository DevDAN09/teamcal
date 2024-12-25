"use client";

import { useCallback, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { TaskBlock, TaskFormData } from "../types/schedule";
import { TaskModal } from "./TaskModal";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { useTaskManagement } from "../hooks/useTaskManagement";
import { useMediaQuery } from "../hooks/useMediaQuery";

interface CalendarProps {
  teamId: string;
}

export function Calendar({ teamId }: CalendarProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<{
    start: string;
    end: string;
  } | null>(null);

  const {
    tasks,
    selectedTask,
    modalMode,
    isDeleteDialogOpen,
    handleTaskSubmit,
    handleDeleteConfirm,
    setSelectedTask,
    setModalMode,
    setIsDeleteDialogOpen
  } = useTaskManagement(teamId);

  const handleDateSelect = useCallback((selectInfo: any) => {
    const start = new Date(selectInfo.startStr);
    const end = new Date(selectInfo.endStr);
    
    setSelectedDates({
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    });
    setModalMode("create");
    setIsModalOpen(true);
  }, [setModalMode]);

  const handleEventClick = useCallback((clickInfo: any) => {
    const task = tasks.find((t) => t.id === clickInfo.event.id);
    if (task) {
      setSelectedTask(task);
      setModalMode("edit");
      setIsModalOpen(true);
    }
  }, [tasks, setSelectedTask, setModalMode]);

  const events = tasks.map((task) => ({
    id: task.id,
    title: `${task.userName}: ${task.description}`,
    start: task.startDate,
    end: new Date(task.endDate + 'T00:00:00'),
    backgroundColor: task.color,
    allDay: true
  }));

  return (
    <div className="h-[calc(100vh-12rem)] md:h-[calc(100vh-8rem)]">
      <style jsx global>{`
        .fc .fc-toolbar-title {
          font-size: 1rem;  /* 모바일에서 작은 크기 */
        }
        @media (min-width: 768px) {
          .fc .fc-toolbar-title {
            font-size: 1.5rem;  /* 데스크톱에서 더 큰 크기 */
          }
        }
      `}</style>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView={isMobile ? "dayGridMonth" : "dayGridMonth"}
        headerToolbar={isMobile ? {
          left: "prev,next",
          center: "title",
          right: "today"
        } : {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek"
        }}
        views={{
          dayGridMonth: {
            titleFormat: { 
              month: 'long', 
              year: 'numeric' 
            },
            dayHeaderFormat: { 
              weekday: isMobile ? 'narrow' : 'short' 
            }
          }
        }}
        eventContent={(arg) => {
          return (
            <div className={`${isMobile ? 'text-xs' : 'text-sm'} p-1 truncate`}>
              {arg.event.title}
            </div>
          )
        }}
        dayHeaderContent={(arg) => {
          return (
            <div className={`${isMobile ? 'text-xs' : 'text-sm'}`}>
              {arg.text}
            </div>
          )
        }}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={isMobile ? 2 : true}
        weekends={true}
        events={events}
        select={handleDateSelect}
        eventClick={handleEventClick}
        height="100%"
        contentHeight="auto"
        expandRows={true}
        stickyHeaderDates={true}
        handleWindowResize={true}
      />

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={handleTaskSubmit}
        mode={modalMode}
        initialData={
          modalMode === "create"
            ? selectedDates
              ? {
                  userName: "",
                  description: "",
                  startDate: selectedDates.start,
                  endDate: selectedDates.end,
                }
              : undefined
            : selectedTask
            ? {
                userName: selectedTask.userName,
                description: selectedTask.description,
                startDate: selectedTask.startDate,
                endDate: selectedTask.endDate,
              }
            : undefined
        }
      />

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}