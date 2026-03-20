import { FiImage } from 'react-icons/fi';
import './EmptyState.css';

function EmptyState({ title, description }) {
  return (
    <section className="vf-empty-state" role="status">
      <FiImage size={26} />
      <h2>{title}</h2>
      <p>{description}</p>
    </section>
  );
}

export default EmptyState;
