import React, { useEffect, useState } from "react";
import { Table, Space, Input, Row, Col, Divider, Typography } from "antd";
import axios from "axios";
import Column from "antd/lib/table/Column";
import ColumnGroup from "antd/lib/table/ColumnGroup";
import JeepneysInfoModal from "./JeepneysInfoModal";
import AddJeepneyModal from "./AddJeepneyModal";
import EditJeepneyModal from "./EditJeepneyModal";
import AddJeepneyImageModal from "./AddJeepneyImageModal";

function JeepneysTableList() {
  const [jeepneys, setJeepneys] = useState([]);
  const { Search } = Input;
  const [dataFromModal, setDataFromModal] = useState("");
  const { Title } = Typography;

  useEffect(() => {
    axios
      .get("/api/v1/jeepneys/")
      .then((res) => {
        let data = res.data;
        data = data.map((d) => {
          if (d.barangay === null) {
            return { ...d, barangayName: "None Assigned" };
          } else {
            return { ...d, barangayName: d.barangay.barangayName };
          }
        });

        setJeepneys(data);
      })
      .catch((error) => console.log(error));
  }, []);

  const onSearch = (value) => {
    axios
      .post("/api/v1/jeepneys/search_jeepneys", { value: value })
      .then((_res) => {
        console.log(_res);
        let data = _res.data;
        data = data.map((d) => {
          if (d.barangay === null) {
            return { ...d, barangayName: "None Assigned" };
          } else {
            return { ...d, barangayName: d.barangay.barangayName };
          }
        });

        setJeepneys(data);
        console.log("success");
      });

    console.log(value);
  };

  const modalClosed = () => {
    console.log("Passed data from modal", dataFromModal);
    axios.get("/api/v1/jeepneys/").then((res) => {
      let data = res.data;
      data = data.map((d) => {
        if (d.barangay === null) {
          return { ...d, barangayName: "None Assigned" };
        } else {
          return { ...d, barangayName: d.barangay.barangayName };
        }
      });

      setJeepneys(data);
    });
  };

  return (
    <div>
      <Row justify="space-between">
        <Col span={4}>
          <Space direction="vertical">
            <Search
              placeholder="Search Jeepney"
              onSearch={onSearch}
              allowClear={true}
              enterButton
            />
          </Space>
        </Col>
        <Col span={4}>
          <AddJeepneyModal
            info={""}
            passedData={setDataFromModal}
            afterClosing={modalClosed}
          />
        </Col>
      </Row>
      <Divider>
        <Title level={4}>List of Jeepneys</Title>
      </Divider>
      <Row>
        <Table dataSource={jeepneys} scroll={{ x: 1000, y: 500 }} sticky>
          <Column
            title="Barangay"
            dataIndex="barangayName"
            key="barangayId"
          ></Column>
          <ColumnGroup
            title="Plate Number"
            dataIndex="plateNumber"
            key="plateNumber"
          ></ColumnGroup>
          <ColumnGroup
            title="Jeep Capacity"
            dataIndex="jeepCapacity"
            key="jeepCapacity"
          ></ColumnGroup>
          {/* <ColumnGroup
            title="Current Driver"
            dataIndex="currentDriver"
            key="currentDriver"
          ></ColumnGroup> */}
          <ColumnGroup
            title="Actions"
            key="actions"
            fixed="right"
            width="35vh"
            render={(value) => (
              <Space>
                <JeepneysInfoModal
                  info={value}
                  passedData={setDataFromModal}
                  afterClosing={modalClosed}
                />
                <EditJeepneyModal
                  info={value}
                  passedData={setDataFromModal}
                  afterClosing={modalClosed}
                />
                <AddJeepneyImageModal info={value} />
              </Space>
            )}
          ></ColumnGroup>
        </Table>
      </Row>
    </div>
  );
}

export default JeepneysTableList;
