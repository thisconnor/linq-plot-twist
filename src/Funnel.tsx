import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Code2, Mail, MessageCircle, Phone, Plane } from 'lucide-react';
import { BRAND } from './scenario';
import { PlotLogo } from './Brands';

export function Landing({ onContinue, onSkip }: { onContinue(): void; onSkip(): void }) {
  return <div className="landing">
    <div className="landing-copy">
      <div className="eyebrow">A LINQ GROWTH EXPERIMENT</div>
      <h1 tabIndex={-1}>Let them try it.<br /><span>Then ask for the meeting.</span></h1>
      <p>A personalized preview of a developer’s own product in iMessage. Something useful to open the conversation.</p>
      <button className="button button-primary" onClick={onContinue}>Walk me through it <ArrowRight size={17}/></button>
      <button className="text-button landing-skip" onClick={onSkip}>Jump to the demo</button>
    </div>
    <div className="landing-note" aria-label="Example invitation from Linq">
      <span className="note-sender"><Mail size={17}/> A NOTE FROM LINQ</span>
      <p>“We made a preview of your travel assistant in iMessage. Want to try it?”</p>
      <div className="note-preview"><Plane size={18}/><span>Plot Twist Travel<small>One prospect. One useful example.</small></span><ArrowRight size={18}/></div>
    </div>
    <div className="landing-trail"><span>The idea</span><ArrowRight size={14}/><span>The invitation</span><ArrowRight size={14}/><span>The experience</span></div>
  </div>;
}

const steps = [
  { title: 'Cold email. Informed by signals.', text: 'Not completely cold: start with a select set of customer profiles, then look for companies showing relevant signals.', example: 'For this example: a funded AI travel company, an existing conversational assistant, and customers who need help on the move. Plot Twist Travel is fictional.' },
  { title: 'Build for them. Then send it.', text: 'AI custom-builds a lightweight demo for each company before outreach. Review the experience, then cold email that company an invitation.', example: 'Here, the preview uses Plot Twist’s brand, its assistant Alex, and a travel workflow. The email leads with something they can try.' },
  { title: 'Ask after they’ve felt the value.', text: 'Let the developer experience it as their customer. Then ask whether it could fit their product.', example: 'That’s the experiment: can a relevant first experience earn more qualified conversations?' },
];
export function GuidedExplanation({ onContinue, onBack }: { onContinue(): void; onBack(): void }) {
  const [step, setStep] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus({preventScroll:true}); }, [step]);
  const current = steps[step];
  return <div className="guided-explanation">
    <div className="guide-progress" aria-label={`Explanation step ${step + 1} of 3`}>{steps.map((_, i) => <span key={i} className={i <= step ? 'reached' : ''}/>)}</div>
    <div className="eyebrow">THE IDEA · {step + 1} OF 3</div>
    <h1 tabIndex={-1} ref={heading}>{current.title}</h1>
    <p className="guide-lead">{current.text}</p>
    <div className="guide-example" key={step}>
      {step === 0 && <><div className="guide-product"><PlotLogo/></div><div className="guide-agent"><img src={BRAND.avatar} alt="Alex, fictional AI assistant"/><div><strong>Alex</strong><span>Plot Twist’s AI travel assistant</span></div><Phone size={20}/></div></>}
      {step === 1 && <><Mail size={28}/><strong className="guide-invitation">Your voice assistant.<br />Now in iMessage.</strong><span className="guide-linq">A personalized preview from Linq</span></>}
      {step === 2 && <div className="guide-conversation"><span><MessageCircle size={22}/> Try the experience</span><ArrowRight size={20}/><span><Code2 size={22}/> Discuss the fit</span></div>}
      <p>{current.example}</p>
    </div>
    <div className="guide-controls"><button className="text-button" onClick={() => step === 0 ? onBack() : setStep(step - 1)}><ArrowLeft size={15}/> Back</button><button className="button button-dark" onClick={() => step === 2 ? onContinue() : setStep(step + 1)}>{step === 2 ? 'See the invitation' : 'Next'}<ArrowRight size={16}/></button></div>
  </div>;
}
