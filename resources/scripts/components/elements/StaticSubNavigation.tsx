import styled from 'styled-components/macro';
import tw from 'twin.macro';

const StaticSubNavigation = styled.div`
    ${tw`w-full overflow-x-auto`};

    & > div {
        ${tw`flex items-center text-sm mx-auto px-2`};
        max-width: 1200px;

        & > a, & > div {
            ${tw`inline-block py-4 px-4 text-neutral-300 no-underline whitespace-nowrap transition-all duration-150`};

            &:not(:first-of-type) {
                ${tw`ml-2`};
            }
        }
    }
`;

export default StaticSubNavigation;
