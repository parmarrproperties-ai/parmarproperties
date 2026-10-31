import { render, type RenderOptions } from '@testing-library/react';
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom';

interface Options extends RenderOptions {
  routerProps?: MemoryRouterProps;
}

export function renderWithProviders(
  ui: React.ReactElement,
  { routerProps, ...renderOptions }: Options = {}
) {
  return render(
    <MemoryRouter {...routerProps}>
      {ui}
    </MemoryRouter>,
    renderOptions
  );
}
