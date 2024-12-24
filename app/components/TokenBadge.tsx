import {Crown} from 'lucide-react';
import {useState} from 'react';

export function TokenBadge() {
  const [isExpanded, setIsExpanded] = useState(false);

  const discounts = [
    'Belts - 40% off',
    'Hoodies - 30% off',
    'Puffer/Padded Jackets - 30% off',
    'Fishing Shirts - 30% off',
    'T-Shirts - 30% off',
    'Wild Rags - 30% off',
    'Bags - 20% off',
    'Wallets - 20% off',
    'Caps - 15% off',
    'Soft Shells - 15% off',
  ];

  return (
    <>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-white bg-gray-950 text-xs round px-3 py-1.5 items-center gap-2 rounded inline-flex font-semibold text-nowrap"
      >
        <Crown className="w-4 h-4" />
        VIP
      </button>
      {/* Dropdown panel */}
      <div
        className={`
        absolute top-full right-[-80px] mt-2 w-80
        bg-contrast rounded-lg shadow-lg border border-primary/10
        transform transition-all duration-200
        ${
          isExpanded
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }
      `}
      >
        <div className="p-4">
          <h3 className="text-sm uppercase text-primary/90 tracking-wider text-accent font-medium mb-3">
            What You&apos;ve Unlocked
          </h3>
          <div className="space-y-2.5">
            {discounts.map((discount) => (
              <div key={discount} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-accent" />
                <p className="text-sm text-primary/90">{discount}</p>
              </div>
            ))}
            <a href="/token-check">
              <div className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-fit">
                Check Ticket
              </div>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
