import { Link } from 'react-router-dom';
import PageContainer from './components/PageContainer';
import Header from './components/Header';
import Button from './components/Button';

function AboutPage() {
  return (
    <PageContainer>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        {/* The centered box */}
        <div className="bg-white rounded-2xl shadow-md p-10 text-center max-w-md w-full">
          <Header title="About Fridge Tracker" />

          <p className="text-lg leading-relaxed text-gray-500 mb-10">
            This app helps you keep track of items in your fridge! 
            Never forget what's inside again.
          </p>

          <Link to="/" className="block">
            <Button className="w-full">Back to Fridge</Button>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}

export default AboutPage;