<script lang="ts">
  import Construction from 'lucide-svelte/icons/construction';
  import Map from 'lucide-svelte/icons/map';
  import Satellite from 'lucide-svelte/icons/satellite';
  import FileText from 'lucide-svelte/icons/file-text';
  import Settings from 'lucide-svelte/icons/settings';
  import RefreshCcw from 'lucide-svelte/icons/refresh-ccw';
  import Shuffle from 'lucide-svelte/icons/shuffle';
  import Anchor from 'lucide-svelte/icons/anchor';
  import AlertCircle from 'lucide-svelte/icons/alert-circle';
  import Globe from 'lucide-svelte/icons/globe';
  import Zap from 'lucide-svelte/icons/zap';
  import Link from 'lucide-svelte/icons/link';
  import Wrench from 'lucide-svelte/icons/wrench';
  import Lock from 'lucide-svelte/icons/lock';
  import Camera from 'lucide-svelte/icons/camera';
  import Footprints from 'lucide-svelte/icons/footprints';
  import Telescope from 'lucide-svelte/icons/telescope';
  import Package from 'lucide-svelte/icons/package';
  import ShieldCheck from 'lucide-svelte/icons/shield-check';
  import Home from 'lucide-svelte/icons/home';
  import BookOpen from 'lucide-svelte/icons/book-open';
  import ChevronLeft from 'lucide-svelte/icons/chevron-left';
  import ChevronRight from 'lucide-svelte/icons/chevron-right';
  import ExternalLink from 'lucide-svelte/icons/external-link';
  import HelpCircle from 'lucide-svelte/icons/help-circle';
  import Check from 'lucide-svelte/icons/check';
  import X from 'lucide-svelte/icons/x';
  import Bomb from 'lucide-svelte/icons/bomb';
  import CircleAlert from 'lucide-svelte/icons/circle-alert';
  import ArrowRight from 'lucide-svelte/icons/arrow-right';
  import ArrowLeft from 'lucide-svelte/icons/arrow-left';
  import Search from 'lucide-svelte/icons/search';
  import Bug from 'lucide-svelte/icons/bug';
  import Hash from 'lucide-svelte/icons/hash';
  import Inbox from 'lucide-svelte/icons/inbox';
  import Waves from 'lucide-svelte/icons/waves';
  import Lightbulb from 'lucide-svelte/icons/lightbulb';
  import ShieldAlert from 'lucide-svelte/icons/shield-alert';
  import CheckCircle from 'lucide-svelte/icons/check-circle';
  import Activity from 'lucide-svelte/icons/activity';
  import Layers from 'lucide-svelte/icons/layers';
  import FolderTree from 'lucide-svelte/icons/folder-tree';
  import Send from 'lucide-svelte/icons/send';
  import ArrowRightLeft from 'lucide-svelte/icons/arrow-right-left';

  import type { ComponentType, SvelteComponent } from 'svelte';
  import type { IconProps } from 'lucide-svelte';

  interface Props {
    name: string;
    size?: number;
    class?: string;
    color?: string;
  }

  let { name, size = 18, class: className = '', color = 'currentColor' }: Props = $props();

  // Map of string names to components
  const iconMap: Record<string, ComponentType<SvelteComponent<IconProps>>> = {
    Construction,
    Map,
    Satellite,
    FileText,
    Settings,
    RefreshCcw,
    Shuffle,
    Anchor,
    AlertCircle,
    Globe,
    Zap,
    Link,
    Wrench,
    Lock,
    Camera,
    Footprints,
    Telescope,
    Package,
    ShieldCheck,
    Home,
    BookOpen,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    Check,
    X,
    Bomb,
    CircleAlert,
    ArrowRight,
    ArrowLeft,
    Search,
    Bug,
    Hash,
    Inbox,
    Waves,
    Lightbulb,
    ShieldAlert,
    CheckCircle,
    Activity,
    Layers,
    FolderTree,
    Send,
    ArrowRightLeft
  };

  const SelectedIcon = $derived(iconMap[name] || HelpCircle);
</script>

<SelectedIcon {size} class={className} {color} />
