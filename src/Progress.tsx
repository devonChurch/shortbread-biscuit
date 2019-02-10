import React, { Component } from "react";
import { Progress } from "antd";
import styled from "./styled";
import { colors } from "./statics";

const Container = styled.div`
  display: grid;
  grid-row-gap: 12px;
`;

const Divider = styled.div`
  background: ${colors.bgLight};
  border: 2px solid ${colors.bg200};
  padding: 12px;

  .ant-progress-inner {
    background: white;
  }
`;

interface IProps {
  compareData?: number;
  getFrequencies?: number;
  createAssociations?: number;
  createCombinations?: number;
}

interface IState {
  compareData: number;
  getFrequencies: number;
  createAssociations: number;
  createCombinations: number;
}

export class CombinationsProgress extends Component<IProps, IState> {
  state: IState = {
    compareData: 0,
    getFrequencies: 0,
    createAssociations: 0,
    createCombinations: 0
  };

  static getDerivedStateFromProps(props: IProps, state: IState) {
    return {
      ...state,
      ...props
    };
  }

  render() {
    const {
      compareData,
      getFrequencies,
      createAssociations,
      createCombinations
    } = this.state;

    return (
      <Container>
        <Divider>
          <h4>Comparing Data</h4>
          <Progress percent={Math.ceil(compareData)} status="active" />
        </Divider>
        <Divider>
          <h4>Calculating Frequencies</h4>
          <Progress percent={Math.ceil(getFrequencies)} status="active" />
        </Divider>
        <Divider>
          <h4>Creating Associations</h4>
          <Progress percent={Math.ceil(createAssociations)} status="active" />
        </Divider>
        <Divider>
          <h4>Creating Combinations</h4>
          <Progress percent={Math.ceil(createCombinations)} status="active" />
        </Divider>
      </Container>
    );
  }
}
