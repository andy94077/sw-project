import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { Row, Col, Button, Popconfirm } from "antd";
import { stringify } from "qs";
import List from "./components/List";

// @withI18n()
// @connect(({ user, loading }) => ({ user, loading }))
class User extends PureComponent {
  handleRefresh = (newQuery) => {
    const history = useHistory();
    const { location } = this.props;
    const { query, pathname } = location;

    history.push({
      pathname,
      search: stringify(
        {
          ...query,
          ...newQuery,
        },
        { arrayFormat: "repeat" }
      ),
    });
  };

  handleDeleteItems = () => {
    const { dispatch, user } = this.props;
    const { list, pagination, selectedRowKeys } = user;

    dispatch({
      type: "user/multiDelete",
      payload: {
        ids: selectedRowKeys,
      },
    }).then(() => {
      this.handleRefresh({
        page:
          list.length === selectedRowKeys.length && pagination.current > 1
            ? pagination.current - 1
            : pagination.current,
      });
    });
  };

  render() {
    const selectedRowKeys = "Patricia Williams";

    return (
      <div>
        {/* <Filter {...this.filterProps} /> */}
        {/* {selectedRowKeys.length > 0 && (
          <Row style={{ marginBottom: 24, textAlign: "right", fontSize: 13 }}>
            <Col>
              {`Selected ${selectedRowKeys.length} items `}
              <Popconfirm
                title="Are you sure delete these items?"
                placement="left"
                onConfirm={this.handleDeleteItems}
              >
                <Button type="primary" style={{ marginLeft: 8 }}>
                  Remove
                </Button>
              </Popconfirm>
            </Col>
          </Row>
        )} */}
        <List />
        {/* <Modal /> */}
      </div>
    );
  }
}

User.propTypes = {
  user: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
};

export default User;
