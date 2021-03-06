import React, { useEffect, useState } from "react";
import { Table, Space, Input, Row, Col, Divider, Typography } from "antd";
import axios from "axios";
import Column from "antd/lib/table/Column";
import ColumnGroup from "antd/lib/table/ColumnGroup";
import BarangaysInfoModal from "./BarangaysInfoModal";
import AddBarangayModal from "./AddBarangayModal";
import EditBarangayModal from "./EditBarangayModal";
import AddBarangayImageModal from "./AddBarangayImageModal";

function BarangaysTableList() {
  const [barangays, setBarangays] = useState([]);
  const { Search } = Input;
  const [dataFromModal, setDataFromModal] = useState("");
  const {Title} = Typography;

  useEffect(() => {
    axios
      .get("/api/v1/barangays/search_all_barangays")
      .then((res) => {
        // console.log(res);

        let data = res.data;
        setBarangays(data);
      })
      .catch((error) => console.log(error));
  }, []);

  const onSearch = (value) => {
    axios
      .post("/api/v1/barangays/search_barangays", { value: value })
      .then((_res) => {
        console.log(_res);
        let data = _res.data;
        setBarangays(data);
        console.log("success");
      });

    //console.log(value);
  };

  const modalClosed = () => {
    console.log("Passed data from modal", dataFromModal);
    axios.get("/api/v1/barangays/search_all_barangays").then((res) => {
      //console.log(res);
      let data = res.data;
      setBarangays(data);
    });
  };

  return (
    <div>
      <Row justify="space-between">
        <Col span={4}>
          <Space direction="vertical">
            <Search
              placeholder="Search Barangay"
              onSearch={onSearch}
              allowClear={true}
              enterButton
            />
          </Space>
        </Col>
        <Col span={4}>
          <AddBarangayModal
            info={""}
            passedData={setDataFromModal}
            afterClosing={modalClosed}
          />
        </Col>
      </Row>
      <Divider>
          <Title level={4}>List of Barangays</Title>
      </Divider>
      <Row>
        <Table dataSource={barangays} scroll={{ x: 1000, y: 500 }} sticky>
          {/* <ColumnGroup title="Id" dataIndex="id" key="id"></ColumnGroup> */}
          {/* <ColumnGroup title="Name" key="name"> */}
          <Column
            title="Barangay Name"
            dataIndex="barangayName"
            key="barangayName"
          ></Column>
          {/* </ColumnGroup> */}
          <ColumnGroup
            title="Location"
            dataIndex="location"
            key="location"
          ></ColumnGroup>
          <ColumnGroup
            title="Barangay Description"
            dataIndex="barangayDescription"
            key="barangayDescription"
          ></ColumnGroup>
          <ColumnGroup
            title="Actions"
            key="actions"
            fixed="right"
            width="35vh"
            render={(value) => (
              <Space>
                <BarangaysInfoModal
                  info={value}
                  passedData={setDataFromModal}
                  afterClosing={modalClosed}
                />
                <EditBarangayModal
                  info={value}
                  passedData={setDataFromModal}
                  afterClosing={modalClosed}
                />
                <AddBarangayImageModal info={value} />
              </Space>
            )}
          ></ColumnGroup>
        </Table>
      </Row>
    </div>
  );
}

export default BarangaysTableList;
