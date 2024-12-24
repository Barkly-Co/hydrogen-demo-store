// app/components/UnlockDiscounts.tsx
import {useState} from 'react';
import {useRevalidator} from '@remix-run/react';
import {Lock, Unlock, Sparkles} from 'lucide-react';
import confetti from 'canvas-confetti';

import {applyDiscountCodes} from '~/lib/discount';

export function UnlockDiscounts() {
  const [unlocking, setUnlocking] = useState(false);
  const revalidator = useRevalidator();

  const triggerConfetti = () => {
    // First burst with default colors
    confetti({
      particleCount: 100,
      spread: 70,
      origin: {y: 0.6},
    });

    // Second burst after a short delay
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: {x: 0},
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: {x: 1},
      });
    }, 250);
  };

  const handleUnlock = async () => {
    setUnlocking(true);
    const codes = [
      'XMAS_40_OFF',
      'XMAS_30_OFF',
      'XMAS_20_OFF',
      'XMAS_15_OFF',
      'XMAS_PUFFERS',
    ];
    try {
      const response = await fetch('/api/discount-token', {
        method: 'POST',
        credentials: 'same-origin',
      });

      if (response.ok) {
        await applyDiscountCodes(codes);
        triggerConfetti();
        revalidator.revalidate();
      } else {
        // eslint-disable-next-line no-console
        console.log('error');
      }
    } finally {
      setUnlocking(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleUnlock}
        disabled={unlocking}
        className={`
          group
          relative
          flex items-center gap-2
          px-6 py-3 rounded-full
          bg-gradient-to-r from-purple-600 to-blue-600
          text-white font-medium text-lg
          hover:from-purple-500 hover:to-blue-500
          transition-all duration-500
          disabled:opacity-50
          // transform hover:scale-105
          shadow-lg hover:shadow-xl
          ${unlocking ? 'animate-pulse' : ''}
        `}
      >
        {unlocking ? (
          <>
            <Lock className="w-5 h-5 animate-bounce" />
            <span>Unlocking...</span>
          </>
        ) : (
          <>
            <Unlock className="w-5 h-5 group-hover:rotate-12 transition-transform duration-500" />
            <span>Unlock Boxing Day Sale</span>
          </>
        )}
      </button>
    </div>
  );
}
