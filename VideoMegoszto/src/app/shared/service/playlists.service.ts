import { Injectable } from '@angular/core';
import { Playlist, ListaLathatosag } from '../models/playlist';
import playlists from '../../../../public/jsons/playlistak.json';

@Injectable({
  providedIn: 'root'
})
export class PlaylistsService {
  private playlists: Playlist[] = [];

  constructor() {
    this.loadPlaylists();
  }

  private loadPlaylists() {
    this.playlists = playlists.map(playlist => ({
      _id: playlist._id,
      nev: playlist.nev,
      leiras: playlist.leiras,
      keszitoId: playlist.keszitoId,
      videoIdk: playlist.videoIdk || [],
      letrehozasDatuma: new Date(playlist.letrehozasDatuma),
      utolsoModositasDatuma: new Date(playlist.utolsoModositasDatuma),
      lathatosag: this.convertToListaLathatosag(playlist.lathatosag)
    }));
  }

  getAllPlaylists(): Playlist[] {
    return this.playlists;
  }

  getPlaylistById(id: number): Playlist | undefined {
    return this.playlists.find(playlist => playlist._id === id);
  }

  getPlaylistsByUserId(userId: number): Playlist[] {
    return this.playlists.filter(playlist => playlist.keszitoId === userId);
  }

  private convertToListaLathatosag(value: string): ListaLathatosag {
    switch (value) {
      case 'public':
        return ListaLathatosag.Nyilvanos;
      case 'private':
        return ListaLathatosag.Privat;
      default:
        return ListaLathatosag.Nyilvanos;
    }
  }
}
