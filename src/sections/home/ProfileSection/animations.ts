import type { Variants } from 'framer-motion';
import { animation } from '../../../design-tokens';

export const contentVariants: Variants = animation.content;
export const listVariants: Variants = animation.list.variants;
export const itemVariants: Variants = animation.list.item;

export const resumeLinkOrder = ['website', 'blog', 'github', 'linkedin'] as const;
