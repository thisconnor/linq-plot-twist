import { useState } from 'react';
import { motion } from 'motion/react';
import { MessageCircle, Phone, X } from 'lucide-react';
import type { DemoState } from './state';

const points = [
  { voice: ['Catch both options.', 'Alex reads out the flights. Departure and arrival times pass as you listen.'], message: ['Compare at a glance.', 'The same options become a card you can look over.'] },
  { voice: ['Your choice, acknowledged.', 'Alex confirms the flight out loud and asks what else you need.'], message: ['A little reassurance.', 'A reaction and read receipt acknowledge you before the reply.'] },
  { voice: ['Picture the route.', 'Alex explains the turns. You’re holding a leash and trying to remember them.'], message: ['See where to go.', 'The route stays on screen. Open the map for a closer look.'] },
  { voice: ['That gate number just went by.', 'Alex explains the change. You can ask again if the airport noise wins.'], message: ['The change stays here.', 'Old gate, new gate, updated map. Come back and check.'] },
  { voice: ['A new wrinkle, worked through.', 'Alex adjusts dinner around your boarding time. A few details to hold in mind.'], message: ['A plan for both appetites.', 'Food stops and timing sit together in a card you can check.'] },
  { voice: ['A helpful conversation.', 'The call ends with a workable plan. Now it’s yours to remember.'], message: ['Keep the useful bits.', 'The flight, dinner plan, and Alex stay in your conversation.'] },
];
export function WhyMessage({ state }: { state: DemoState }) {
  const [dismissed, setDismissed] = useState(false);
  const currentMessages = state.messages.filter(m => m.id.startsWith(`${state.run}-`));
  const ready = state.turn === 2 ? currentMessages.some(m => m.reaction)
    : state.turn === 6 ? state.stage === 'complete'
    : currentMessages.some(m => m.attachment === (state.turn === 1 ? 'flights' : state.turn === 3 ? 'map' : state.turn === 4 ? 'update' : 'food'));
  if (!ready) return null;
  const point = points[state.turn - 1];
  return <div className={`channel-notes ${dismissed ? 'notes-hidden' : ''}`} aria-live="polite">
    <div className="notes-control"><button onClick={() => setDismissed(!dismissed)}>{dismissed ? <MessageCircle size={12}/> : <X size={12}/>} {dismissed ? 'Show channel notes' : 'Hide both notes'}</button></div>
    {!dismissed && <>{(['voice', 'message'] as const).map(channel => <motion.aside key={channel} className={`channel-note-card note-${channel}`} initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} transition={{duration:.2}} aria-label={channel === 'voice' ? 'About the call' : 'Why iMessage?'}>
      <span>{channel === 'voice' ? <Phone size={11}/> : <MessageCircle size={11}/>} {channel === 'voice' ? 'ON THE CALL' : 'WHY IMESSAGE?'}</span>
      <h3>{point[channel][0]}</h3><p>{point[channel][1]}</p>
    </motion.aside>)}</>}
  </div>;
}
