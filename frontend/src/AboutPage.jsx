import { Link } from 'react-router-dom';
import PageContainer from './components/PageContainer';
import Header from './components/Header';
import Button from './components/Button';

function AboutPage() {
  return (
    <PageContainer>
      <div className="flex flex-col justify-center text-center flex-1">
        <Header title="About Fridge Tracker" />
        
        <p className="text-lg leading-relaxed text-gray-600 mb-10">
          This app helps you keep track of items in your fridge! 
          Never forget what's inside again.
        </p>
        
        <Link to="/" className="block">
          <Button className="w-full">
            Back to Fridge
          </Button>
        </Link>
      </div>
    </PageContainer>
  );
}

export default AboutPage;
