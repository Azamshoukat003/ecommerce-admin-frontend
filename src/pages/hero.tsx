import { CONFIG } from 'src/config-global';

import { ProductsView } from 'src/sections/product/view';
import Hero from 'src/sections/hero/Hero';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Hero - ${CONFIG.appName}`}</title>

      <Hero />
    </>
  );
}
