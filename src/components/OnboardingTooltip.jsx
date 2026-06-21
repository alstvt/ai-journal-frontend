export default function OnboardingTooltip({ onDismiss }) {
  return (
    <div className="onboarding-tip">
      <div className="onboarding-tip__arrow" />
      <p className="onboarding-tip__text">
        Выбери, как с тобой говорить: <strong>Друг</strong> — тепло и поддержка, <strong>Стоик</strong> — спокойствие и ясность, <strong>Прямой</strong> — без смягчений. Можно менять в любой момент.
      </p>
      <button className="onboarding-tip__close" onClick={onDismiss}>Понятно</button>
    </div>
  );
}