// This file provides type declarations for react-test-renderer
declare module 'react-test-renderer' {
  import { ReactElement } from 'react';

  // Main TestRenderer interface
  export interface ReactTestRenderer {
    toJSON(): ReactTestRendererJSON | null;
    toTree(): ReactTestRendererTree | null;
    unmount(nextElement?: ReactElement): void;
    update(nextElement: ReactElement): void;
    getInstance(): any;
    root: ReactTestInstance;
  }

  // ReactTestRendererJSON represents the JSON structure
  export interface ReactTestRendererJSON {
    type: string;
    props: { [propName: string]: any };
    children: null | Array<ReactTestRendererJSON | string>;
  }

  // ReactTestRendererTree represents the tree structure
  export interface ReactTestRendererTree {
    nodeType: string;
    type: string;
    props: { [propName: string]: any };
    instance: any;
    rendered: null | Array<ReactTestRendererTree>;
  }

  // ReactTestInstance represents a component instance
  export interface ReactTestInstance {
    instance: any;
    type: string;
    props: { [propName: string]: any };
    parent: null | ReactTestInstance;
    children: Array<ReactTestInstance | string>;
    find(predicate: (instance: ReactTestInstance) => boolean): ReactTestInstance;
    findByType(type: string | Function): ReactTestInstance;
    findByProps(props: { [propName: string]: any }): ReactTestInstance;
    findAll(predicate: (instance: ReactTestInstance) => boolean, options?: { deep: boolean }): Array<ReactTestInstance>;
    findAllByType(type: string | Function, options?: { deep: boolean }): Array<ReactTestInstance>;
    findAllByProps(props: { [propName: string]: any }, options?: { deep: boolean }): Array<ReactTestInstance>;
  }

  // The main rendering function
  export function create(
    nextElement: ReactElement,
    options?: { createNodeMock: (element: ReactElement) => any }
  ): ReactTestRenderer;

  // Act function for testing asynchronous code
  export function act(callback: () => void | Promise<void>): Promise<undefined>;
}
