import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, Check, Code2, Mail, MessageCircle, Search, Users } from 'lucide-react';
const steps = [
  { title: 'Find the fit', label: '01 / QUALIFY', icon: Search, detail: 'An AI-forward company with the capacity to buy and a customer workflow that makes sense in iMessage.', example: 'Here: a travel product with an existing voice agent.' },
  { title: 'Prepare the preview', label: '02 / PERSONALIZE', icon: Code2, detail: 'Use public product context to adapt a useful customer scenario. Review the facts and relevance before sharing.', example: 'Here: Plot Twist’s assistant helps a stranded traveler and their dog.' },
  { title: 'Invite the developer', label: '03 / OFFER', icon: Mail, detail: 'Offer a small, relevant experience they can explore before committing time to a meeting.', example: '“We made a preview of your assistant in iMessage.”' },
  { title: 'Let them try it', label: '04 / EXPERIENCE', icon: MessageCircle, detail: 'The developer steps into their customer’s shoes and sees how the same agent could work in another channel.', example: 'A flight decision. A persistent plan. A reason to talk.' },
  { title: 'Earn the conversation', label: '05 / MEASURE', icon: Users, detail: 'Ask whether this fits their product. Track qualified meetings and cost, with booked and held meetings separate.', example: 'The outcome to test. This preview is the first execution artifact.' },
];
export function Funnel({ onContinue, onSkip }: { onContinue(): void; onSkip(): void }) {
  const [active, setActive] = useState(0);
  const current = steps[active];
  return <div className="funnel-layout">
    <div className="funnel-intro"><div className="eyebrow"><span className="status-dot" /> THE PROPOSED GROWTH EXPERIMENT</div>
      <h1 tabIndex={-1}>Give them the experience.<br /><span>Then earn the meeting.</span></h1>
      <p>A personalized preview of a prospect’s own customer workflow, delivered before the meeting ask. Here’s how the experiment would work.</p><button className="text-button funnel-quick-skip" onClick={onSkip}>Skip to demo <ArrowUpRight size={14}/></button>
    </div>
    <div className="funnel-workbench">
      <div className="funnel-topline"><span>FROM QUALIFIED ACCOUNT TO QUALIFIED CONVERSATION</span><span>Explore the steps</span></div>
      <ol className="funnel-path" aria-label="Proposed growth funnel">
        {steps.map((step, i) => <li key={step.title} className={active === i ? 'active' : ''}>
          <button onClick={() => setActive(i)} aria-pressed={active === i} aria-label={`${i + 1}. ${step.title}`}>
            <span className="funnel-icon"><step.icon size={22} strokeWidth={1.5} /></span><small>0{i + 1}</small><strong>{step.title}</strong>
          </button>{i < 4 && <ArrowRight className="funnel-connector" size={19} aria-hidden="true" />}
        </li>)}
      </ol>
      <div className="funnel-detail" aria-live="polite">
        <motion.div key={active} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} transition={{duration:.18}}>
          <div className="eyebrow">{current.label}</div><h2>{current.title}.</h2><p>{current.detail}</p><span className="funnel-example">{current.example}</span>
        </motion.div>
        <div className="preview-object"><span className="object-overline">ONE ACCOUNT. ONE USEFUL EXAMPLE.</span><div className="object-brand">plot twist <small>TRAVEL</small></div><div className="channel-evolution"><span><span className="evolution-dot" /> Existing voice agent</span><ArrowRight size={18}/><span className="new-channel">+ iMessage</span></div><span className="powered object-powered">Powered by <strong>linq</strong></span></div>
      </div>
    </div>
    <div className="funnel-next"><p><span>UP NEXT</span> Step into the developer’s inbox. Then try the preview as their customer.</p><button className="button button-primary" onClick={onContinue}>Become the developer <ArrowRight size={17}/></button></div>
    <details className="validation"><summary>Proposed validation process <span>+</span></summary><div className="validation-content"><p><strong>Check understanding.</strong> Recruit about five willing testers. Aim for four of five to finish unassisted and explain the benefit. This has not happened yet.</p><p><strong>Check production effort.</strong> Compare 5-, 10-, and 15-minute adaptation and review budgets against one quality checklist. Initial template development is a separate cost.</p><p><strong>Test the invitation.</strong> Compare this offer with a standard meeting invitation among comparable qualified accounts. Track qualified meetings and costs. Small samples are directional.</p></div></details>
  </div>;
}
export function DeveloperQuestions({ answered = false }: { answered?: boolean }) {
  return <div className={`developer-questions ${answered ? 'questions-answered' : ''}`}>
    <div className="question-root"><Code2 size={17}/><span>{answered ? 'BACK IN THE DEVELOPER’S SHOES' : 'THE DEVELOPER’S QUESTIONS'}</span></div>
    <div className="question-branches">{['Does this fit my product?', 'What would my customers gain?', 'Is this worth a conversation?'].map((q,i)=><div key={q}><span>{answered && i < 2 ? <Check size={14}/> : '·'}</span>{q}</div>)}</div>
    {!answered && <small>Illustrative questions the preview needs to answer.</small>}
  </div>;
}
