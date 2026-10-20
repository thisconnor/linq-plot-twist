import { ChevronLeft, ChevronRight, Mic, Plus, Video } from "lucide-react";
import { Avatar, StatusBar } from "./App";
import { ATTACHMENTS, TRIP, timeLabel } from "./scenario";
import "./intro-message-phone.css";

export default function IntroMessagePhone() {
  return (
    <div className="phone message-phone scroll-preview-phone intro-message-phone">
      <StatusBar clock={TRIP.startMinutes} />
      <div className="intro-message-contact">
        <ChevronLeft
          className="intro-message-back"
          size={25}
          aria-hidden="true"
        />
        <div className="intro-message-person">
          <Avatar />
          <strong>
            Alex <ChevronRight size={10} aria-hidden="true" />
          </strong>
          <span>Plot Twist · AI travel assistant</span>
        </div>
        <Video className="intro-message-video" size={21} aria-hidden="true" />
      </div>
      <div className="intro-message-thread">
        <p className="intro-message-time">
          <span>iMessage</span>
          Today {timeLabel(TRIP.startMinutes)} PM
        </p>
        <p className="intro-message-bubble intro-message-outgoing">
          My flight was canceled. Can you help?
        </p>
        <p className="intro-message-bubble intro-message-incoming">
          Two flights home tonight. I’d take the nonstop.
        </p>
        <div className="intro-message-photo">
          <img src={ATTACHMENTS.flights.src} alt={ATTACHMENTS.flights.alt} />
        </div>
      </div>
      <div className="intro-message-compose" aria-hidden="true">
        <span className="intro-message-plus">
          <Plus size={21} />
        </span>
        <span className="intro-message-field">
          iMessage <Mic size={17} />
        </span>
      </div>
      <span className="home-indicator" />
    </div>
  );
}
