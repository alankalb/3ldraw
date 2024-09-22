'use client';

import { Tldraw, DefaultCanvas } from 'tldraw';
import 'tldraw/tldraw.css';
import { Canvas } from './canvas';

const threeD = true;

export default function Home() {
  return (
    <main className='fixed inset-0'>
      <Tldraw
        persistenceKey='3ldraw'
        components={{ Canvas: threeD ? Canvas : DefaultCanvas }}
      />
    </main>
  );
}
