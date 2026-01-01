import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getDeviceId, getNickname, generateRoomCode } from '@/lib/device';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface Pod {
  id: string;
  room_code: string;
  room_name: string;
  host_device_id: string;
  current_question_id: string | null;
  is_active: boolean;
}

export interface PodMember {
  id: string;
  pod_id: string;
  device_id: string;
  nickname: string;
  score: number;
}

export function usePods() {
  const [activePods, setActivePods] = useState<Pod[]>([]);
  const [currentPod, setCurrentPod] = useState<Pod | null>(null);
  const [members, setMembers] = useState<PodMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  const fetchActivePods = useCallback(async () => {
    const { data } = await supabase
      .from('pods')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    setActivePods((data || []) as Pod[]);
  }, []);

  const createPod = useCallback(async (roomName: string) => {
    setLoading(true);
    const deviceId = getDeviceId();
    const roomCode = generateRoomCode();

    const { data, error } = await supabase
      .from('pods')
      .insert({
        room_code: roomCode,
        room_name: roomName,
        host_device_id: deviceId,
      })
      .select()
      .single();

    if (error) {
      setLoading(false);
      throw error;
    }

    const pod = data as Pod;
    
    await supabase.from('pod_members').insert({
      pod_id: pod.id,
      device_id: deviceId,
      nickname: getNickname(),
    });

    setCurrentPod(pod);
    setLoading(false);
    return pod;
  }, []);

  const joinPod = useCallback(async (roomCode: string) => {
    setLoading(true);
    const deviceId = getDeviceId();

    const { data: pod, error: findError } = await supabase
      .from('pods')
      .select('*')
      .eq('room_code', roomCode.toUpperCase())
      .eq('is_active', true)
      .single();

    if (findError || !pod) {
      setLoading(false);
      throw new Error('Room not found');
    }

    const { data: existing } = await supabase
      .from('pod_members')
      .select('*')
      .eq('pod_id', pod.id)
      .eq('device_id', deviceId)
      .maybeSingle();

    if (!existing) {
      await supabase.from('pod_members').insert({
        pod_id: pod.id,
        device_id: deviceId,
        nickname: getNickname(),
      });
    }

    setCurrentPod(pod as Pod);
    setLoading(false);
    return pod as Pod;
  }, []);

  const leavePod = useCallback(async () => {
    if (!currentPod) return;
    
    const deviceId = getDeviceId();
    
    await supabase
      .from('pod_members')
      .delete()
      .eq('pod_id', currentPod.id)
      .eq('device_id', deviceId);

    if (currentPod.host_device_id === deviceId) {
      await supabase
        .from('pods')
        .update({ is_active: false })
        .eq('id', currentPod.id);
    }

    channel?.unsubscribe();
    setCurrentPod(null);
    setMembers([]);
    setChannel(null);
  }, [currentPod, channel]);

  const updateScore = useCallback(async (points: number) => {
    if (!currentPod) return;
    
    const deviceId = getDeviceId();
    const member = members.find(m => m.device_id === deviceId);
    
    if (member) {
      await supabase
        .from('pod_members')
        .update({ score: member.score + points })
        .eq('pod_id', currentPod.id)
        .eq('device_id', deviceId);
    }
  }, [currentPod, members]);

  useEffect(() => {
    if (!currentPod) return;

    const newChannel = supabase
      .channel(`pod-${currentPod.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pod_members',
          filter: `pod_id=eq.${currentPod.id}`,
        },
        async () => {
          const { data } = await supabase
            .from('pod_members')
            .select('*')
            .eq('pod_id', currentPod.id)
            .order('score', { ascending: false });
          
          setMembers((data || []) as PodMember[]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'pods',
          filter: `id=eq.${currentPod.id}`,
        },
        (payload) => {
          setCurrentPod(payload.new as Pod);
        }
      )
      .subscribe();

    setChannel(newChannel);

    supabase
      .from('pod_members')
      .select('*')
      .eq('pod_id', currentPod.id)
      .order('score', { ascending: false })
      .then(({ data }) => setMembers((data || []) as PodMember[]));

    return () => {
      newChannel.unsubscribe();
    };
  }, [currentPod]);

  useEffect(() => {
    fetchActivePods();
  }, [fetchActivePods]);

  return {
    activePods,
    currentPod,
    members,
    loading,
    createPod,
    joinPod,
    leavePod,
    updateScore,
    refetchPods: fetchActivePods,
  };
}
