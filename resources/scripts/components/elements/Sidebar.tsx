import tw from 'twin.macro';
import styled from 'styled-components/macro';
import { withSubComponents } from '@/components/helpers';

const Wrapper = styled.div`
  ${tw`w-full flex flex-col px-4`};
  & > a {
    ${tw`h-12 w-full flex flex-row items-center text-neutral-300 cursor-pointer select-none px-5`};
    ${tw`hover:text-neutral-50`};
    & > svg {
      ${tw`h-6 w-6 flex flex-shrink-0`};
    }
    & > span {
      ${tw`font-header font-medium text-lg whitespace-nowrap leading-none ml-3`};
    }
    &:active, &.active {
      ${tw`text-neutral-50 bg-neutral-800 rounded`};
    }
  }
`;

const Section = styled.div`
  ${tw`h-6 font-header font-medium text-xs text-neutral-300 whitespace-nowrap uppercase ml-4 mb-1 select-none`};
  &:not(:first-of-type) {
    ${tw`mt-4`};
  }
`;

const User = styled.div`
  ${tw`h-16 w-full flex items-center bg-neutral-700 justify-center`};
`;

const Sidebar = styled.div`
  ${tw`h-screen hidden md:flex flex-col items-center flex-shrink-0 bg-neutral-900 overflow-x-hidden ease-linear`};
  ${tw`w-48`};
  & > a {
    ${tw`flex flex-row items-center text-neutral-300 cursor-pointer select-none px-8`};
    ${tw`hover:text-neutral-50`};
    & > svg {
      ${tw`transition-none h-6 w-6 flex flex-shrink-0`};
    }
    & > span {
      ${tw`font-header font-medium text-lg whitespace-nowrap leading-none ml-3`};
    }
  }
`;

export default withSubComponents(Sidebar, { Section, Wrapper, User });
