import type { ComponentType } from 'react';
import type { BlockType } from '@/data/seo/types';
import { BlockPlaceholder } from './BlockPlaceholder';
import { HeroBlock } from './HeroBlock';
import { HeroGeneratorBlock } from './HeroGeneratorBlock';
import { PricingStripBlock } from './PricingStripBlock';
import { GalleryBlock } from './GalleryBlock';
import { ScenarioChipsBlock } from './ScenarioChipsBlock';
import { HowItWorksBlock } from './HowItWorksBlock';
import { EditorialBlock } from './EditorialBlock';
import { FaqBlock } from './FaqBlock';
import { FinalCtaBlock } from './FinalCtaBlock';
import { ToolGridBlock } from './ToolGridBlock';
import { ModelGridBlock } from './ModelGridBlock';
import { RelatedLinksBlock } from './RelatedLinksBlock';
import { TldrBlock } from './TldrBlock';
import { TocBlock } from './TocBlock';
import { StepsBlock } from './StepsBlock';

const P: ComponentType<any> = BlockPlaceholder;

export const blockRegistry: Record<BlockType, ComponentType<any>> = {
  hero: HeroBlock,
  heroGenerator: HeroGeneratorBlock,
  interactiveDemo: P,
  beforeAfter: P,
  gallery: GalleryBlock,
  modelGrid: ModelGridBlock,
  toolGrid: ToolGridBlock,
  scenarioChips: ScenarioChipsBlock,
  howItWorks: HowItWorksBlock,
  capabilities: P,
  specs: P,
  pricingStrip: PricingStripBlock,
  comparisonTable: P,
  editorial: EditorialBlock,
  faq: FaqBlock,
  relatedLinks: RelatedLinksBlock,
  breadcrumbs: P,
  finalCta: FinalCtaBlock,
  tldr: TldrBlock,
  toc: TocBlock,
  steps: StepsBlock,
};