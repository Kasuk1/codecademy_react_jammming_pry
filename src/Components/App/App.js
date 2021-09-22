import React from "react";

//Style Sheet
import "./App.css";

//Imported Components
import {SearchBar} from "../SearchBar/SearchBar";
import {SearchResult} from "../SearchResult/SearchResult";
import {Playlist} from "../Playlist/Playlist";

//Spotify API functionality
import Spotify from "../../util/Spotify";

//Font-Awesome API
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlay, faPlayCircle, faPause, faPauseCircle } from "@fortawesome/free-solid-svg-icons";
library.add(faPlay, faPlayCircle, faPause, faPauseCircle)

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: "",
      playlistTracks: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlayListName = this.updatePlayListName.bind(this);
    this.savePlayList = this.savePlayList.bind(this);
    this.search = this.search.bind(this);
  }

 /* MANAGE TRACKS IN playList STATE - ADD(TRACK), REMOVE(TRACK), UPDATE(PLAYLISTNAME) */
  addTrack(track) {
    const idFound = this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id);
    if(idFound) {
      return;
    } else {
      this.setState({
        playlistTracks: [...this.state.playlistTracks, track]
      });
      sessionStorage.setItem( "playlistTracks", JSON.stringify([...this.state.playlistTracks, track]) );
    }
  }

  removeTrack(track) {
    this.setState({
      playlistTracks: this.state.playlistTracks.filter(savedTrack => savedTrack.id !== track.id)
    });
    sessionStorage.setItem("playlistTracks", JSON.stringify(this.state.playlistTracks.filter(savedTrack => savedTrack.id !== track.id)) );
  }

  updatePlayListName(name) {
    this.setState({
      playlistName: name
    });
    sessionStorage.setItem("playlistName", name);
  }
  /* MANAGE TRACKS IN playList STATE - ADD(TRACK), REMOVE(TRACK), UPDATE(PLAYLISTNAME) */


  /* SEARCH TRACKS THROUGH SPOTIFY'S SERVER */
  search(term) {
    Spotify.search(term).then(tracks => {
      const filteredTracks = tracks.filter(({id: searchTrackID}) => {
        const playlistTracksIDs = this.state.playlistTracks.map(playlistTrack => playlistTrack.id);
        return playlistTracksIDs.every(listTrackID => listTrackID !== searchTrackID);
      });

      this.setState({
        searchResults: filteredTracks
      });

    });
  }
  /* SEARCH TRACKS THROUGH SPOTIFY'S SERVER */


   /* SAVE NEW PLAYLIST AND TRACKS TO IT IN SPOTIFY'S ACCOUNT */
   savePlayList() {
    const playlistName = this.state.playlistName;
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(playlistName ,trackURIs).then(() => {
      this.setState({
        playlistName: "",
        playlistTracks: []
      });
      sessionStorage.setItem("playlistName", "");
      sessionStorage.setItem("playlistTracks", []);
    });
  }
  /* SAVE NEW PLAYLIST IN SPOTIFY'S ACCOUNT */

  render() {
    /* let token;
    if(window.location.hash) {
      token = Spotify.getReturnedParams(window.location.hash);
    } */

    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResult searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playListName={this.state.playlistName} 
                      playListTracks={this.state.playlistTracks} 
                      onRemove={this.removeTrack} 
                      onNameChange={this.updatePlayListName}
                      onSave={this.savePlayList} />
          </div>
        </div>
      </div>
      );
  }

  componentDidMount(props) {
    Spotify.getAccessToken();

    this.setState({
      playlistName: sessionStorage.getItem("playlistName"),
      playlistTracks: [] || JSON.parse(sessionStorage.getItem("playlistTracks"))
    });
    
  }

}

