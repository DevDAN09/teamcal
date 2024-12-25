"use client";

import { useState, useEffect } from "react";
import { TaskBlock, TaskFormData } from "../types/schedule";
import { supabase } from "@/lib/supabase";

export function useTaskManagement(teamId: string) {
  const [tasks, setTasks] = useState<TaskBlock[]>([]);
  const [selectedTask, setSelectedTask] = useState<TaskBlock | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // 태스크 목록 불러오기
  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('team_id', teamId);
      
      if (error) {
        console.error('Error fetching tasks:', error);
        return;
      }

      setTasks(data.map(task => ({
        id: task.id,
        teamId: task.team_id,
        userName: task.user_name,
        description: task.description,
        startDate: task.start_date,
        endDate: task.end_date,
        color: task.color
      })));
    };

    fetchTasks();
  }, [teamId]);

  // 태스크 생성/수정
  const handleTaskSubmit = async (data: TaskFormData) => {
    if (modalMode === "create") {
      const newTask = {
        team_id: teamId,
        user_name: data.userName,
        description: data.description,
        start_date: data.startDate,
        end_date: data.endDate,
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`
      };

      const { data: createdTask, error } = await supabase
        .from('tasks')
        .insert([newTask])
        .select()
        .single();

      if (error) {
        console.error('Error creating task:', error);
        return;
      }

      setTasks(prev => [...prev, {
        id: createdTask.id,
        teamId: createdTask.team_id,
        userName: createdTask.user_name,
        description: createdTask.description,
        startDate: createdTask.start_date,
        endDate: createdTask.end_date,
        color: createdTask.color
      }]);
    } else if (modalMode === "edit" && selectedTask) {
      const { error } = await supabase
        .from('tasks')
        .update({
          user_name: data.userName,
          description: data.description,
          start_date: data.startDate,
          end_date: data.endDate
        })
        .eq('id', selectedTask.id);

      if (error) {
        console.error('Error updating task:', error);
        return;
      }

      setTasks(prev =>
        prev.map(task =>
          task.id === selectedTask.id
            ? { ...task, ...data }
            : task
        )
      );
    }
  };

  // 태스크 삭제
  const handleDeleteConfirm = async () => {
    if (selectedTask) {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', selectedTask.id);

      if (error) {
        console.error('Error deleting task:', error);
        return;
      }

      setTasks(prev => prev.filter(task => task.id !== selectedTask.id));
      setIsDeleteDialogOpen(false);
      setSelectedTask(null);
    }
  };

  useEffect(() => {
    const channel = supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `team_id=eq.${teamId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newTask = payload.new;
            setTasks(prev => [...prev, {
              id: newTask.id,
              teamId: newTask.team_id,
              userName: newTask.user_name,
              description: newTask.description,
              startDate: newTask.start_date,
              endDate: newTask.end_date,
              color: newTask.color
            }]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedTask = payload.new;
            setTasks(prev => prev.map(task =>
              task.id === updatedTask.id
                ? {
                    id: updatedTask.id,
                    teamId: updatedTask.team_id,
                    userName: updatedTask.user_name,
                    description: updatedTask.description,
                    startDate: updatedTask.start_date,
                    endDate: updatedTask.end_date,
                    color: updatedTask.color
                  }
                : task
            ));
          } else if (payload.eventType === 'DELETE') {
            setTasks(prev => prev.filter(task => task.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [teamId]);

  return {
    tasks,
    selectedTask,
    modalMode,
    isDeleteDialogOpen,
    handleTaskSubmit,
    handleDeleteConfirm,
    setSelectedTask,
    setModalMode,
    setIsDeleteDialogOpen
  };
}