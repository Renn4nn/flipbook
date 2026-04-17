import React from 'react';
import styles from './page-loading-skeleton.module.css';
import Logo from '@/ui/layout/logo';

export default function PageLoadingSkeleton() {
  const text = "CARREGANDO...";
  const letters = text.split("");

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logoWrapper}>
          <Logo />
        </div>
        <div className={styles.brand}>
          {letters.map((char, index) => (
            <span 
              key={index} 
              className={styles.letter}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
}