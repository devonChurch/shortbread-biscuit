import React, { SFC } from "react";
import styled from "./styled";

interface IProps {
  title: string;
  background: string;
  minCard: number | string;
  maxCard: number | string;
}

const Container = styled.section<{ background: string }>`
  background: ${({ background }) => background};
  padding: 16px;
`;

const Heading = styled.h2`
  color: white;
  margin: 0 0 16px;
`;

const Grid = styled.div<{ minCard: number | string; maxCard: number | string }>`
  display: grid;
  grid-template-columns: ${({ minCard, maxCard }) =>
    `repeat(auto-fit, minmax(${minCard}, ${maxCard}))`};
  grid-gap: 16px;
`;

const Section: SFC<IProps> = ({
  title,
  background,
  minCard,
  maxCard,
  children
}) => (
  <Container background={background}>
    <Heading>{title}</Heading>
    <Grid minCard={minCard} maxCard={maxCard}>
      {children}
    </Grid>
  </Container>
);

export default Section;
