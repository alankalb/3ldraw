'use client';

import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';
import { Canvas } from './canvas';

export default function Home() {
  return (
    <main className='fixed inset-0'>
      <Tldraw persistenceKey='3ldraw' components={{ Canvas: Canvas }} />
    </main>
  );
}
