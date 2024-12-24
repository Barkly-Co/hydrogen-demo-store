import {Crown} from 'lucide-react';
import {useState, useEffect, useRef} from 'react';

interface Discount {
  id: string;
  description: string;
  percentage: number;
}

export function TokenBadge(): JSX.Element {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Early return if click target isn't a Node (shouldn't happen, but TypeScript wants us to check)
      if (!(event.target instanceof Node)) return;

      // Check if the click was outside both the dropdown and button
      const clickedOutsideDropdown =
        dropdownRef.current && !dropdownRef.current.contains(event.target);
      const clickedOutsideButton =
        buttonRef.current && !buttonRef.current.contains(event.target);

      if (clickedOutsideDropdown && clickedOutsideButton) {
        setIsExpanded(false);
      }
    };

    // Add the event listener only if the dropdown is expanded
    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]); // Add isExpanded as a dependency

  const discounts: Discount[] = [
    {id: 'belts', description: 'Belts - 40% off', percentage: 40},
    {id: 'hoodies', description: 'Hoodies - 30% off', percentage: 30},
    {
      id: 'jackets',
      description: 'Puffer/Padded Jackets - 30% off',
      percentage: 30,
    },
    {id: 'fishing', description: 'Fishing Shirts - 30% off', percentage: 30},
    {id: 'tshirts', description: 'T-Shirts - 30% off', percentage: 30},
    {id: 'rags', description: 'Wild Rags - 30% off', percentage: 30},
    {id: 'bags', description: 'Bags - 20% off', percentage: 20},
    {id: 'wallets', description: 'Wallets - 20% off', percentage: 20},
    {id: 'caps', description: 'Caps - 15% off', percentage: 15},
    {id: 'shells', description: 'Soft Shells - 15% off', percentage: 15},
  ];

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-white bg-gray-950 text-xs round px-3 py-1.5 items-center gap-2 rounded inline-flex font-semibold text-nowrap"
        type="button"
      >
        <Crown className="w-4 h-4" />
        VIP
      </button>

      <div
        ref={dropdownRef}
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
            {discounts.map(({id, description}) => (
              <div key={id} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-accent" />
                <p className="text-sm text-primary/90">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
