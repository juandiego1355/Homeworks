import { Injectable } from '@angular/core';
import { createClient, type Session, type SupabaseClient, type User } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  readonly configured =
    environment.supabaseUrl.startsWith('https://') &&
    !environment.supabaseUrl.includes('YOUR_PROJECT') &&
    environment.supabaseAnonKey.length > 20 &&
    !environment.supabaseAnonKey.includes('YOUR_SUPABASE');

  readonly client: SupabaseClient;

  constructor() {
    if (!this.configured) {
      this.client = createClient('https://placeholder.supabase.co', 'placeholder-anon-key');
      return;
    }
    this.client = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
  }

  async register(email: string, password: string, fullName: string): Promise<Session | null> {
    const { data, error } = await this.client.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) throw error;
    return data.session;
  }

  async login(email: string, password: string): Promise<Session | null> {
    const { data, error } = await this.client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.session;
  }

  async logout(): Promise<void> {
    const { error } = await this.client.auth.signOut();
    if (error) throw error;
  }

  async getTasks(): Promise<Task[]> {
    const { data, error } = await this.client
      .from('tasks')
      .select('id,user_id,title,description,completed,created_at,updated_at')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Task[];
  }

  async createTask(task: Pick<Task, 'user_id' | 'title' | 'description' | 'completed'>): Promise<void> {
    const { error } = await this.client.from('tasks').insert(task);
    if (error) throw error;
  }

  async updateTask(id: string, updates: Partial<Pick<Task, 'title' | 'description' | 'completed'>>): Promise<void> {
    const { error } = await this.client.from('tasks').update(updates).eq('id', id);
    if (error) throw error;
  }

  async deleteTask(id: string): Promise<void> {
    const { error } = await this.client.from('tasks').delete().eq('id', id);
    if (error) throw error;
  }

  watchTasks(userId: string, onChange: () => void, onError: (message: string) => void) {
    return this.client
      .channel(`tasks-${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `user_id=eq.${userId}` }, onChange)
      .subscribe((status, error) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          onError(
            error?.message ?? 'No se pudo mantener la lista sincronizada en tiempo real. Recarga para volver a intentarlo.',
          );
        }
      });
  }

  async uploadAvatar(userId: string, file: File): Promise<User> {
    if (!file.type.startsWith('image/')) throw new Error('Selecciona un archivo de imagen.');
    if (file.size > 5 * 1024 * 1024) throw new Error('La imagen debe pesar menos de 5 MB.');

    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `${userId}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await this.client.storage.from('avatars').upload(path, file, {
      cacheControl: '3600',
      contentType: file.type,
      upsert: false,
    });
    if (uploadError) throw uploadError;

    const { data } = this.client.storage.from('avatars').getPublicUrl(path);
    const { data: userData, error: updateError } = await this.client.auth.updateUser({
      data: { avatar_url: data.publicUrl },
    });
    if (updateError) throw updateError;
    return userData.user;
  }
}
