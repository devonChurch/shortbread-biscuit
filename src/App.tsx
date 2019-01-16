import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Row, Col } from "antd";
import {
  IReduxCompleteState,
  IReduxLottoDataState,
  IReduxRangeDataState,
  IReduxSelectState,
  IBallData,
  ILottoDataJson,
  IComboData,
  IDrawData
} from "./types";
import {
  lottoDataFetch,
  rangeDataCreate,
  selectToggle,
  selectClear
} from "./redux/actions";
import { colors, dateFormat } from "./statics";
import { getTimeNow } from "./helpers";
import Select from "./Select";
import Time from "./Time";
import Statistic from "./Statistic";
import Draw from "./Draw";
import Combinations from "./Combinations";
import ContentSpinner from "./ContentSpinner";
import ContentProgress from "./ContentProgress";

interface IAppState {}

interface IMapStateToProps
  extends IReduxLottoDataState,
    IReduxRangeDataState,
    IReduxSelectState {}

interface IMapDispatchToProps {
  lottoDataFetch: () => void;
  rangeDataCreate: (
    {
      lottoDataAll,
      rangeDataOldest,
      rangeDataNewest
    }: {
      lottoDataAll: ILottoDataJson[];
      rangeDataOldest: number;
      rangeDataNewest: number;
    }
  ) => void;
  selectToggle: (ballNum: number) => void;
  selectClear: () => void;
}

interface IAppProps extends IMapStateToProps, IMapDispatchToProps {}

class App extends Component<IAppProps, IAppState> {
  state: IAppState = {};
  worker: Worker;

  constructor(props: IAppProps) {
    super(props);
    console.log(this);
    this.worker = Worker && new Worker("worker.js");
    this.props.lottoDataFetch();
  }

  checkShouldProgressUpdate = (() => {
    let prevUpdate = getTimeNow();

    return () => {
      const currentUpdate = getTimeNow();
      const nextUpdate = prevUpdate + 500;
      const shouldUpdate = currentUpdate > nextUpdate;

      if (shouldUpdate) {
        prevUpdate = currentUpdate;
      }

      return shouldUpdate;
    };
  })();

  componentDidMount() {
    // if (Worker) {
    //   this.worker.onmessage = event => {
    //     const { isComplete, combinations, progress } = event.data;
    //     if (isComplete) {
    //       this.setState(prevState => ({
    //         ...prevState,
    //         workerPercent: 99
    //       }));
    //       setTimeout(() => {
    //         this.setState(prevState => ({
    //           ...prevState,
    //           workerPercent: 100,
    //           rangeDataCombinations: enrichCombinationsWithColor(combinations)
    //         }));
    //       }, 500);
    //     } else if (this.checkShouldProgressUpdate()) {
    //       this.setState(prevState => ({
    //         ...prevState,
    //         workerPercent: Math.round(
    //           (progress / prevState.rangeDataAll.length) * 100
    //         )
    //       }));
    //     }
    //   };
    // }
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
    this.props.rangeDataCreate({
      lottoDataAll: this.props.lottoDataAll,
      rangeDataOldest: moment(oldestString, dateFormat).valueOf(),
      rangeDataNewest: moment(newestString, dateFormat).valueOf()
    });
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
      rangeDataCombinations,
      rangeDataDraws,
      rangeDataOldest,
      rangeDataNewest,
      //
      currentBalls,
      //
      selectToggle,
      selectClear
    } = this.props;
    const workerPercent = 50;
    return (
      <div style={{ background: colors.bgLight, minHeight: "100vh" }}>
        <div
          style={{
            background: colors.bgDark,
            padding: "8px 16px"
          }}
        >
          <h1 style={{ color: "white", margin: 0 }}>Lotto Settings</h1>
          <Row type="flex" gutter={16}>
            <Col span={24} xs={24} lg={24} xxl={12} style={{ margin: "8px 0" }}>
              <Select
                handleToggle={selectToggle}
                checkIsActive={this.checkIsCurrentBallActive}
                handleClear={
                  Boolean(currentBalls.length) ? selectClear : undefined
                }
              />
            </Col>

            <Col span={24} xs={24} lg={24} xxl={12} style={{ margin: "8px 0" }}>
              <Time
                absoluteOldestDate={lottoDataOldestDate}
                absoluteNewestDate={lottoDataNewestDate}
                currentOldestDate={rangeDataOldest}
                currentNewestDate={rangeDataNewest}
                handleChange={this.updateFromToDates}
                totalCurrentDraws={rangeDataTotalItems}
                totalPossibleDraws={lottoDataTotalItems}
              />
            </Col>
          </Row>
        </div>

        <div style={{ padding: "16px" }}>
          <Row type="flex" gutter={16}>
            <Col span={24} xs={24} style={{ margin: "8px 0" }}>
              <h2>Single Balls</h2>
              <p style={{ maxWidth: "900px" }}>
                Looking at each <em>Lotto Ball</em> in isolation. What ball{" "}
                <strong>appeared the most</strong>? Where did each ball fall
                during the <strong>draw order</strong>?
              </p>
            </Col>
            {lottoDataIsFetching ? (
              <ContentSpinner />
            ) : (
              rangeDataBaseBalls.map(({ title, frequencies }: IBallData) => (
                <Col
                  key={title}
                  span={12}
                  xs={8}
                  lg={6}
                  xxl={3}
                  style={{ margin: "8px 0" }}
                >
                  <Statistic
                    title={title}
                    frequencies={frequencies}
                    handleToggle={selectToggle}
                    checkIsActive={this.checkIsCurrentBallActive}
                  />
                </Col>
              ))
            )}
            <Col span={24} xs={24} style={{ margin: "8px 0" }}>
              <h2>Balls Combinations</h2>
              <p style={{ maxWidth: "900px" }}>
                Finding similar <em>Lotto Ball</em> combinations between each
                draw. We disregard <strong>ball order</strong> and instead{" "}
                <strong>aggregate</strong> each combination match based on{" "}
                <strong>ball values</strong>.
              </p>
            </Col>
            {lottoDataIsFetching ? (
              <ContentSpinner />
            ) : workerPercent < 100 ? (
              <ContentProgress percent={workerPercent} />
            ) : (
              rangeDataCombinations.map(
                ({ title, combinations }: IComboData) => (
                  <Col
                    key={title}
                    span={24}
                    xs={24}
                    lg={12}
                    xxl={6}
                    style={{ margin: "8px 0" }}
                  >
                    <Combinations
                      title={title}
                      combinations={combinations}
                      handleToggle={selectToggle}
                      checkIsActive={this.checkIsCurrentBallActive}
                    />
                  </Col>
                )
              )
            )}
            <Col span={24} xs={24} style={{ margin: "8px 0" }}>
              <h2>Power Ball</h2>
              <p style={{ maxWidth: "900px" }}>
                Show the most frequent appearing <em>Lotto Power Ball</em>. This
                part of the draw has no affiliation to the{" "}
                <strong>generic</strong> <em>Lotto Ball</em> references above.
              </p>
            </Col>
            {lottoDataIsFetching ? (
              <ContentSpinner />
            ) : (
              rangeDataPowerBalls.map(({ title, frequencies }: IBallData) => (
                <Col
                  key={title}
                  span={12}
                  xs={8}
                  lg={6}
                  xxl={4}
                  style={{ margin: "8px 0" }}
                >
                  <Statistic title={""} frequencies={frequencies} />
                </Col>
              ))
            )}
            <Col span={24} xs={24} style={{ margin: "8px 0" }}>
              <h2>Draws</h2>
              <p style={{ maxWidth: "900px" }}>
                List the <em>Lotto Draws</em> in descending order{" "}
                <em>
                  (including <strong>Bonus</strong> and <strong>Power</strong>{" "}
                  Balls)
                </em>
                .
              </p>
            </Col>
            {lottoDataIsFetching ? (
              <ContentSpinner />
            ) : (
              rangeDataDraws.map(({ title, draws }: IDrawData) => (
                <Col
                  key={title}
                  span={24}
                  xs={24}
                  lg={12}
                  xxl={8}
                  style={{ margin: "8px 0" }}
                >
                  <Draw
                    title={title}
                    draws={draws}
                    handleToggle={selectToggle}
                    checkIsActive={this.checkIsCurrentBallActive}
                  />
                </Col>
              ))
            )}
          </Row>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: IReduxCompleteState): IMapStateToProps => ({
  ...state.lottoData,
  ...state.rangeData,
  ...state.select
});

// const mapDispatchToProps = (dispatch: any): IMapDispatchToProps => ({
//   lottoDataFetch: (...args) => dispatch(lottoDataFetch(...args)),
//   selectToggle: (...args) => dispatch(selectToggle(...args)),
//   selectClear: (...args) => dispatch(selectClear(...args))
// });

const mapDispatchToProps = {
  lottoDataFetch,
  rangeDataCreate,
  selectToggle,
  selectClear
};

export default connect(
  mapStateToProps, // as () => IMapStateToProps,
  mapDispatchToProps // as () => IMapDispatchToProps
)(App);
