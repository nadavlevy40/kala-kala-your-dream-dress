import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { designers, conditions, silhouettes } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface FilterState {
  priceRange: [number, number];
  designers: string[];
  conditions: string[];
  silhouette: string;
}

interface BuyPageFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  resultCount: number;
}

const silhouetteIcons: Record<string, string> = {
  'נסיכה': '👗',
  'A-Line': '🅰️',
  'סירן': '🧜‍♀️',
  'בוהו': '🌸',
  'מינימליסטית': '◻️',
};

const FilterContent = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters 
}: Pick<BuyPageFiltersProps, 'filters' | 'onFiltersChange' | 'onClearFilters'>) => {
  const handlePriceChange = (value: number[]) => {
    onFiltersChange({ ...filters, priceRange: [value[0], value[1]] });
  };

  const handleDesignerToggle = (designer: string) => {
    const newDesigners = filters.designers.includes(designer)
      ? filters.designers.filter(d => d !== designer)
      : [...filters.designers, designer];
    onFiltersChange({ ...filters, designers: newDesigners });
  };

  const handleConditionToggle = (condition: string) => {
    const newConditions = filters.conditions.includes(condition)
      ? filters.conditions.filter(c => c !== condition)
      : [...filters.conditions, condition];
    onFiltersChange({ ...filters, conditions: newConditions });
  };

  const handleSilhouetteSelect = (sil: string) => {
    onFiltersChange({ 
      ...filters, 
      silhouette: filters.silhouette === sil ? '' : sil 
    });
  };

  const hasActiveFilters = 
    filters.priceRange[0] > 0 || 
    filters.priceRange[1] < 50000 || 
    filters.designers.length > 0 || 
    filters.conditions.length > 0 ||
    filters.silhouette !== '';

  return (
    <div className="space-y-6">
      {/* Price Range */}
      <div className="space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          טווח מחירים
        </h3>
        <div className="px-2">
          <Slider
            value={[filters.priceRange[0], filters.priceRange[1]]}
            onValueChange={handlePriceChange}
            min={0}
            max={50000}
            step={500}
            className="w-full"
          />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>₪{filters.priceRange[1].toLocaleString()}</span>
            <span>₪{filters.priceRange[0].toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Designers */}
      <div className="space-y-4">
        <h3 className="font-semibold">מעצב/ת</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {designers.map((designer) => (
            <div key={designer} className="flex items-center gap-3">
              <Checkbox
                id={`designer-${designer}`}
                checked={filters.designers.includes(designer)}
                onCheckedChange={() => handleDesignerToggle(designer)}
              />
              <Label 
                htmlFor={`designer-${designer}`}
                className="cursor-pointer text-sm"
              >
                {designer}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div className="space-y-4">
        <h3 className="font-semibold">מצב השמלה</h3>
        <div className="space-y-2">
          {conditions.map((condition) => (
            <div key={condition} className="flex items-center gap-3">
              <Checkbox
                id={`condition-${condition}`}
                checked={filters.conditions.includes(condition)}
                onCheckedChange={() => handleConditionToggle(condition)}
              />
              <Label 
                htmlFor={`condition-${condition}`}
                className="cursor-pointer text-sm"
              >
                {condition}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Silhouette */}
      <div className="space-y-4">
        <h3 className="font-semibold">סגנון</h3>
        <div className="grid grid-cols-3 gap-2">
          {silhouettes.map((sil) => (
            <button
              key={sil}
              onClick={() => handleSilhouetteSelect(sil)}
              className={cn(
                'flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all',
                filters.silhouette === sil
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <span className="text-2xl">{silhouetteIcons[sil] || '👗'}</span>
              <span className="text-xs">{sil}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          onClick={onClearFilters} 
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <X className="h-4 w-4 ml-2" />
          נקי את כל הסינונים
        </Button>
      )}
    </div>
  );
};

// Desktop Sidebar
export const DesktopFilters = (props: BuyPageFiltersProps) => {
  return (
    <div className="hidden lg:block w-72 shrink-0">
      <div className="sticky top-24 bg-card rounded-2xl border border-border p-6">
        <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          סינון תוצאות
        </h2>
        <FilterContent 
          filters={props.filters}
          onFiltersChange={props.onFiltersChange}
          onClearFilters={props.onClearFilters}
        />
      </div>
    </div>
  );
};

// Mobile Sheet
export const MobileFilters = (props: BuyPageFiltersProps) => {
  const [open, setOpen] = useState(false);
  
  const hasActiveFilters = 
    props.filters.priceRange[0] > 0 || 
    props.filters.priceRange[1] < 50000 || 
    props.filters.designers.length > 0 || 
    props.filters.conditions.length > 0 ||
    props.filters.silhouette !== '';

  return (
    <div className="lg:hidden flex items-center gap-3 mb-6">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            סינון
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-primary" />
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80 overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-primary" />
              סינון תוצאות
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent 
              filters={props.filters}
              onFiltersChange={props.onFiltersChange}
              onClearFilters={props.onClearFilters}
            />
          </div>
          <div className="mt-6 pt-6 border-t">
            <Button variant="gold" className="w-full" onClick={() => setOpen(false)}>
              הצג {props.resultCount} תוצאות
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Sort Dropdown */}
      <Select value={props.sortBy} onValueChange={props.onSortChange}>
        <SelectTrigger className="w-44">
          <SelectValue placeholder="מיון לפי" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">הכי חדש</SelectItem>
          <SelectItem value="price-low">מחיר: נמוך לגבוה</SelectItem>
          <SelectItem value="price-high">מחיר: גבוה לנמוך</SelectItem>
        </SelectContent>
      </Select>

      <p className="text-sm text-muted-foreground mr-auto">
        {props.resultCount} תוצאות
      </p>
    </div>
  );
};

// Sort bar for desktop
export const SortBar = ({ 
  sortBy, 
  onSortChange, 
  resultCount 
}: Pick<BuyPageFiltersProps, 'sortBy' | 'onSortChange' | 'resultCount'>) => {
  return (
    <div className="hidden lg:flex items-center justify-between mb-6">
      <p className="text-muted-foreground">
        {resultCount} שמלות נמצאו
      </p>
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-44">
          <SelectValue placeholder="מיון לפי" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">הכי חדש</SelectItem>
          <SelectItem value="price-low">מחיר: נמוך לגבוה</SelectItem>
          <SelectItem value="price-high">מחיר: גבוה לנמוך</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
