import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import {
  IReduxCompleteState,
  IReduxLottoDataState,
  IReduxRangeDataState,
  IReduxCombinationsState,
  IReduxSelectState,
  IBallData,
  ILottoDataJson,
  IComboData,
  IDrawData
} from "./types";
import {
  lottoDataFetch,
  rangeDataUpdateBase,
  selectToggle,
  selectClear,
  combinationsCalculate
} from "./redux/actions";
import { createArrayOfLength } from "./helpers";
import { colors, dateFormat } from "./statics";
import Section from "./Section";
import Select from "./Select";
import Time from "./Time";
import Statistic from "./Statistic";
import Draw from "./Draw";
import Combinations from "./Combinations";
import Associations from "./Associations";
import Prediction from "./Prediction";
import {
  SkeletonBaseBalls,
  SkeletonCombinations,
  SkeletonAssociations,
  SkeletonPowerBalls,
  SkeletonDraws
} from "./Skeleton";

interface IAppState {}

interface IMapStateToProps
  extends IReduxLottoDataState,
    IReduxRangeDataState,
    IReduxCombinationsState,
    IReduxSelectState {}

interface IMapDispatchToProps {
  lottoDataFetch: () => void;
  rangeDataUpdateBase: (args: {
    lottoDataAll: ILottoDataJson[];
    rangeDataOldest: number;
    rangeDataNewest: number;
  }) => void;
  selectToggle: (ballNum: number) => void;
  selectClear: () => void;
  combinationsCalculate: () => void;
}

interface IAppProps extends IMapStateToProps, IMapDispatchToProps {}

class App extends Component<IAppProps, IAppState> {
  state: IAppState = {};

  constructor(props: IAppProps) {
    super(props);
  }

  componentDidMount() {
    this.props.lottoDataFetch();
  }

  checkIsCurrentBallActive = (ball: number): boolean => {
    const { currentBalls } = this.props;
    const isEmpty = !currentBalls.length;
    const isActive = currentBalls.includes(ball);

    return isEmpty || isActive;
  };

  updateFromToDates = (
    _: any,
    [oldestString, newestString]: [string, string]
  ) => {
    this.props.rangeDataUpdateBase({
      lottoDataAll: this.props.lottoDataAll,
      rangeDataOldest: moment(oldestString, dateFormat).valueOf(),
      rangeDataNewest: moment(newestString, dateFormat).valueOf()
    });
    this.props.combinationsCalculate();
  };

  render() {
    const {
      lottoDataTotalItems,
      lottoDataOldestDate,
      lottoDataNewestDate,
      lottoDataIsFetching,
      //
      rangeDataTotalItems,
      rangeDataBaseBalls,
      rangeDataPowerBalls,
      rangeDataDraws,
      rangeDataOldest,
      rangeDataNewest,
      //
      currentBalls,
      //
      selectToggle,
      selectClear,
      //
      combinationsData,
      combinationAssociations,
      combinationsIsCalculating
    } = this.props;

    return (
      <div style={{ background: colors.bgLight, minHeight: "100vh" }}>
        <Section
          title="Settings"
          background={colors.bg200}
          minCard="300px"
          maxCard="1fr"
        >
          <Select
            handleToggle={selectToggle}
            checkIsActive={this.checkIsCurrentBallActive}
            handleClear={Boolean(currentBalls.length) ? selectClear : undefined}
          />

          <Time
            absoluteOldestDate={lottoDataOldestDate}
            absoluteNewestDate={lottoDataNewestDate}
            currentOldestDate={rangeDataOldest}
            currentNewestDate={rangeDataNewest}
            handleChange={this.updateFromToDates}
            totalCurrentDraws={rangeDataTotalItems}
            totalPossibleDraws={lottoDataTotalItems}
            isLoading={lottoDataIsFetching}
          />
        </Section>

        {/*
          - - - - - - - - - - - - - - - -
          */}

        <Section
          title="Machine Learning"
          background={colors.bg200}
          minCard="300px"
          maxCard="1fr"
        >
          <Prediction
            handleToggle={selectToggle}
            checkIsActive={this.checkIsCurrentBallActive}
          />
        </Section>

        {/*
          - - - - - - - - - - - - - - - -
          */}

        <Section
          title="Single Balls"
          background={colors.bg200}
          minCard="280px"
          maxCard="1fr"
        >
          {(lottoDataIsFetching
            ? createArrayOfLength(8)
            : rangeDataBaseBalls
          ).map(({ title, frequencies }: IBallData, index) =>
            lottoDataIsFetching ? (
              <SkeletonBaseBalls key={`skeleton${index}`} />
            ) : (
              <Statistic
                key={title}
                title={title}
                frequencies={frequencies}
                handleToggle={selectToggle}
                checkIsActive={this.checkIsCurrentBallActive}
              />
            )
          )}
        </Section>

        {/*
          - - - - - - - - - - - - - - - -
          */}

        <Section
          title="Balls Combinations"
          background={colors.bg200}
          minCard="100%"
          maxCard="1fr"
        >
          {(lottoDataIsFetching
            ? createArrayOfLength(3)
            : combinationsData
          ).map(({ title, total, combinations }: IComboData, index) =>
            lottoDataIsFetching || combinationsIsCalculating ? (
              <SkeletonCombinations key={`skeleton${index}`} />
            ) : (
              <Combinations
                key={title}
                title={title}
                total={total}
                combinations={combinations}
                handleToggle={selectToggle}
                checkIsActive={this.checkIsCurrentBallActive}
              />
            )
          )}
        </Section>

        {/*
          - - - - - - - - - - - - - - - -
          */}

        <Section
          title="Associations"
          background={colors.bg200}
          minCard="1fr"
          maxCard="1fr"
        >
          {lottoDataIsFetching || combinationsIsCalculating ? (
            <SkeletonAssociations />
          ) : (
            <Associations
              associations={combinationAssociations}
              handleToggle={selectToggle}
              checkIsActive={this.checkIsCurrentBallActive}
            />
          )}
        </Section>

        {/*
          - - - - - - - - - - - - - - - -
          */}

        <Section
          title="Power Ball"
          background={colors.bg200}
          minCard="300px"
          maxCard="1fr"
        >
          {(lottoDataIsFetching
            ? createArrayOfLength(1)
            : rangeDataPowerBalls
          ).map(({ frequencies }: IBallData, index) =>
            lottoDataIsFetching ? (
              <SkeletonPowerBalls key={`skeleton${index}`} />
            ) : (
              <Statistic
                key={`powerBall${index}`}
                title={""}
                frequencies={frequencies}
              />
            )
          )}
        </Section>

        {/*
          - - - - - - - - - - - - - - - -
          */}

        <Section
          title="Draws"
          background={colors.bg200}
          minCard="360px"
          maxCard="1fr"
        >
          {(lottoDataIsFetching ? createArrayOfLength(3) : rangeDataDraws).map(
            ({ title, draws }: IDrawData, index) =>
              lottoDataIsFetching ? (
                <SkeletonDraws key={`skeleton${index}`} />
              ) : (
                <Draw
                  key={title}
                  title={title}
                  draws={draws}
                  handleToggle={selectToggle}
                  checkIsActive={this.checkIsCurrentBallActive}
                />
              )
          )}
        </Section>

        {/*
          - - - - - - - - - - - - - - - -
          */}
      </div>
    );
  }
}

const mapStateToProps = (state: IReduxCompleteState): IMapStateToProps => ({
  ...state.lottoData,
  ...state.rangeData,
  ...state.combinations,
  ...state.select
});

// const mapDispatchToProps = (dispatch: any): IMapDispatchToProps => ({
//   lottoDataFetch: (...args) => dispatch(lottoDataFetch(...args)),
//   selectToggle: (...args) => dispatch(selectToggle(...args)),
//   selectClear: (...args) => dispatch(selectClear(...args))
// });

const mapDispatchToProps = {
  lottoDataFetch,
  rangeDataUpdateBase,
  selectToggle,
  selectClear,
  combinationsCalculate
};

export default connect(
  mapStateToProps, // as () => IMapStateToProps,
  mapDispatchToProps // as () => IMapDispatchToProps
)(App);
