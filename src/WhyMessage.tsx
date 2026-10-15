import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, MessageCircle, X } from 'lucide-react';
import type { DemoState } from './state';

const points = [
  { title: 'Two options, side by side.', body: 'Departure, arrival, layover. Compare the choices while Alex talks you through them.' },
  { title: 'A small signal goes a long way.', body: 'The read receipt and reaction acknowledge your choice before the next reply arrives.' },
  { title: 'Directions you can look at.', body: 'Open the map, check the route, and get moving. It stays here while you handle the dog.' },
  { title: 'A change that stays visible.', body: 'The new gate and revised route arrive in the same conversation. Come back and check them.' },
  { title: 'Find that detail again.', body: 'Hands full? Your latest flight card is still here. The gate and boarding time are easy to find.' },
  { title: 'Pick it up when you need it.', body: 'The call ends. Alex’s identity, your conversation, and the latest plan stay together.' },
];
export function WhyMessage({ state }: { state: DemoState }) {
  const [dismissed, setDismissed] = useState(false);
  const currentMessages = state.messages.filter(m => m.id.startsWith(`${state.run}-`));
  const ready = state.turn === 2
    ? currentMessages.some(m => m.reaction)
    : state.turn === 6
      ? state.stage === 'complete'
      : currentMessages.some(m => m.attachment === (state.turn === 1 ? 'flights' : state.turn === 3 ? 'map' : state.turn === 4 ? 'update' : 'plan'));
  const point = points[state.turn - 1];
  if (!ready) return null;
  return <div className="why-message-slot" aria-live="polite">
    <AnimatePresence mode="wait">
      {dismissed ? <button key="reopen" className="why-reopen" onClick={() => setDismissed(false)}><MessageCircle size={14}/> Why iMessage?</button> :
        <motion.aside className="why-message" key="point" initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} exit={{opacity:0}} transition={{duration:.25}} aria-label="Why iMessage?">
          <div className="why-heading"><span><MessageCircle size={13}/> WHY IMESSAGE?</span><button aria-label="Dismiss iMessage explanation" onClick={() => setDismissed(true)}><X size={14}/></button></div>
          <h3>{point.title}</h3><p>{point.body}</p><span className="why-pointer"><ArrowLeft size={13}/> In the conversation</span>
        </motion.aside>}
    </AnimatePresence>
  </div>;
}
