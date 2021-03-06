import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { goBack } from 'connected-react-router';
import { showMessage } from '../../Helpers';
import { fetchEpisodes, fetchShow } from '../../stores/modules/series';
import Tile from '../views/Tile';
import {
  Button, Grid, Row, Column,
} from '../styled/index';
import Modal from './Modal';
import ShowDetails from '../views/ShowDetails';
import EpisodeDetails from '../views/EpisodeDetails';

class Details extends Component {
  constructor(props) {
    super(props);
    this.state = { episode: null, showModal: false };
  }

  componentDidMount() {
    const {
      fetchShow: getShow,
      match: { params: { id } },
      shows,
    } = this.props;
    if (!shows[id]) {
      getShow(id);
    }
  }

  render() {
    const { episode, showModal } = this.state;
    const {
      isFetching,
      error,
      shows,
      match: { params: { id: idx } },
      episodeList = {},
      fetchEpisodes: fetch,
      prev: previous,
    } = this.props;
    if (shows[idx]) {
      const { show } = shows[idx];

      return showMessage(isFetching, error) || (
        <>
          <Modal
            visible={showModal}
            onCancel={() => this.setState({ showModal: false })}
          >
            <h3 slot="header">{ episode && episode.name }</h3>
            <div slot="body">
              <EpisodeDetails item={episode} />
            </div>
          </Modal>
          <ShowDetails item={show} />
          {
                episodeList[idx] ? (
                  <Grid>
                    {episodeList[idx]
                      .map(item => (
                        <Tile
                          item={item}
                          width={250}
                          height={140}
                          key={item.id}
                          onClick={() => this.setState({ episode: item, showModal: true })}
                        />
                      ))}
                  </Grid>
                ) : (
                  <Row>
                    <Column>
                      <Button primary onClick={() => fetch(show.id)}>Show episodes</Button>
                    </Column>
                    <Column>
                      <Button onClick={previous}>Back</Button>
                    </Column>
                  </Row>
                )
              }
        </>
      );
    }
    return <div>loading..</div>;
  }
}

Details.defaultProps = {
  error: null,
};

Details.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.shape({
    body: PropTypes.object,
  }),
  fetchShow: PropTypes.func.isRequired,
  match: PropTypes.shape().isRequired,
  shows: PropTypes.shape({
    show: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      summary: PropTypes.string,
      image: PropTypes.shape({ medium: PropTypes.string }),
    }),
  }).isRequired,
  episodeList: PropTypes.shape({
    id: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        image: PropTypes.shape({ medium: PropTypes.string }),
      }),
    ),
  }).isRequired,
  fetchEpisodes: PropTypes.func.isRequired,
  prev: PropTypes.func.isRequired,
};

const mapStateToProps = ({ series }) => series;

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchShow,
  fetchEpisodes,
  prev: () => goBack(),
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Details);
