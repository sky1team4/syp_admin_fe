"use client"
import { Inter } from 'next/font/google';
import "./globals.css";
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { metadata } from './layout-metadata';

const executeCommand = async () => {
  const response = await fetch("/api/execute-command");
  const data = await response.json();
  console.log(data.output);
};

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
