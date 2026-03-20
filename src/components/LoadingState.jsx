import './LoadingState.css';

function LoadingState({ message }) {
  return (
    <section className="vf-loading-state" role="status" aria-live="polite">
      <span className="vf-loading-state__spinner" aria-hidden="true" />
      <p>{message}</p>
    </section>
  );
}

export default LoadingState;