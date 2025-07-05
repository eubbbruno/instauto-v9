'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { Loader } from '@googlemaps/js-api-loader';
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  StarIcon,
  ClockIcon,
  PhoneIcon,
  ChatBubbleLeftIcon,
  HeartIcon,
  FunnelIcon,
  MapIcon,
  ListBulletIcon,
  CheckBadgeIcon,
  CurrencyDollarIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import Link from 'next/link';
import Header from "../motoristas/components/Header";
import Footer from "../motoristas/components/Footer";

// ... (copiar todo o restante da lógica e JSX da antiga page.tsx, exceto o export default da page)

// No final:
export default BuscarOficinasClient; 