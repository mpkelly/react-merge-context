import * as React from 'react';
import {render, RenderResult} from '@testing-library/react';
import {createContext, MergeType} from '../src';

type Complex = {
  data: {
    nested: string;
  },
  value:number;
}

const ComplexA:Complex = {
  data: {
    nested:"string a"
  },
  value:1
}

const ComplexB:Partial<Complex> = {
  data: {
    nested:"string b"
  },
}

const [Provider, useContext] = createContext<Complex|Partial<Complex>>();

const Component = () => {
  const {data, value} = useContext()
  return (
    <div>
      <h1>{data?.nested}</h1>
      <span>{value}</span>
    </div>
  )
}

const expect = (dom:RenderResult, h1:string, span:number|string) => {
  dom.getByText((content, element) => {
    return element?.tagName.toLowerCase() === 'h1' && content === h1
  })

  dom.getByText((content, element) => {
    return element?.tagName.toLowerCase() === 'span' && content === String(span)
  })
}

describe('it', () => {
  it('provides root value', () => {
    const dom = render((
      <Provider value={ComplexA}>
        <Component />
      </Provider>
    ));

    expect(dom, ComplexA.data.nested, ComplexA.value)
  });

  it('provides merged value by default', () => {
    const dom = render((
      <Provider value={ComplexA}>
        <Provider value={ComplexB}>
        <Component />
        </Provider>
      </Provider>
    ));

    expect(dom, ComplexB?.data?.nested as string, ComplexA.value)
  });

  it('provides merged value explicitly', () => {
    const dom = render((
      <Provider value={ComplexA}>
        <Provider value={ComplexB} mergeType={MergeType.Merge}>
          <Component />
        </Provider>
      </Provider>
    ));

    expect(dom, ComplexB?.data?.nested as string, ComplexA.value)
  });

  it('provides only nested value', () => {
    const dom = render((
      <Provider value={ComplexA}>
        <Provider value={ComplexB} mergeType={MergeType.Replace}>
          <Component />
        </Provider>
      </Provider>
    ));

    expect(dom, ComplexB?.data?.nested as string, "")
  });
});
