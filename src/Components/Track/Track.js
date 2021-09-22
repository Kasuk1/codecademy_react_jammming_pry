import React from "react";

import "./Track.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export class Track extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            paused: true
        };
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.playAudio = this.playAudio.bind(this);
        this.handleEnd = this.handleEnd.bind(this);
    }

    renderAction() {
        if(this.props.isRemoval) {
            return <button className="Track-action" onClick={this.removeTrack}>-</button>;
        } else {
            return <button className="Track-action" onClick={this.addTrack}>+</button>;
        }
    }

    addTrack() {
        this.props.onAdd(this.props.track);
    }

    removeTrack() {
        this.props.onRemove(this.props.track);
    }

    /* Manage Audio Events and states */
    playAudio(e) {
        const id = e.target.id;
        const track = document.getElementById(`audio_${id}`);
        
        if(!id) {
            return;
        } else {
            if(track.paused) {
                track.play();
                this.setState({
                    paused: false
                });
            } else {
                track.pause();
                this.setState({
                    paused: true
                });
            }
        }
    }

    handleEnd(e) {
        this.setState({
            paused: true
        });
    }
    /* Manage Audio Events and states */

    /*Render Correct Font Awesome Icon */
    renderIcon() {
        if(this.props.isRemoval) {
            return;
        } else {
            return (
                <FontAwesomeIcon className="Play-icon" icon={this.state.paused ? "play-circle" : "pause-circle"} 
                                 id={this.props.track.id} onClick={this.playAudio} />
            );
        }
    }
    /*Render Correct Font Awesome Icon */

    render() {

        const backgroundImage = {
            backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, .40), rgba(0, 0, 0, .65)), url(${this.props.track.album_img})`
        }

        const backgroundImageActive = {
            backgroundImage: `linear-gradient(to right, rgba(108, 65, 236, .60), rgb(108, 65, 236, .85)), url(${this.props.track.album_img})`
        }

        return (
            <div className="Track" style={this.state.paused ? backgroundImage : backgroundImageActive}>
                <audio id={`audio_${this.props.track.id}`} src={this.props.track.preview_url} onEnded={this.handleEnd} />
                {this.renderIcon()}
                <div className="Track-information">
                    <h3>{this.props.track.name}</h3>
                    <p>{this.props.track.artist} | {this.props.track.album}</p>
                </div>
                {this.renderAction()}
            </div>
        );
    }

}