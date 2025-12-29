# UI Components

## Button

```tsx
import { Button } from "./components/ui";

<Button variant="primary" size="md">
  Click me
</Button>;
```

### Variants

- `neutral` - White background (default)
- `primary` - Hot pink background
- `secondary` - Electric purple background
- `accent` - Lime background
- `info` - Sky blue background
- `error` - Red background
- `success` - Green background
- `warning` - Sunny yellow background

### Sizes

- `sm` - Small (px-4 py-2)
- `md` - Medium (px-6 py-3) - default
- `lg` - Large (px-8 py-4)

### Props

- `fullWidth` - Boolean to make button full width
- All standard button HTML attributes

---

## Input

```tsx
import { Input } from "./components/ui";

<Input variant="primary" size="md" placeholder="Email..." />;
```

### Variants

- `neutral` - Default white with gray focus ring
- `primary` - Hot pink focus ring
- `secondary` - Electric purple focus ring
- `accent` - Lime focus ring
- `info` - Sky blue focus ring
- `error` - Red focus ring and border
- `success` - Green focus ring and border
- `warning` - Sunny yellow focus ring

### Sizes

- `sm` - Small (px-4 py-2)
- `md` - Medium (px-6 py-3) - default
- `lg` - Large (px-6 py-4)

### Props

- `fullWidth` - Boolean to make input full width
- All standard input HTML attributes
