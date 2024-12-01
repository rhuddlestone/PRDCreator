'use client';

import { useEffect, useState } from 'react';

interface GreetingProps {
  name: string;
}

export function Greeting({ name }: GreetingProps) {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Good Morning';
      if (hour < 18) return 'Good Afternoon';
      return 'Good Evening';
    };

    setGreeting(getGreeting());
  }, []);

  return (
    <h2 className="text-2xl font-semibold mb-2">
      {greeting}, {name}
    </h2>
  );
}
