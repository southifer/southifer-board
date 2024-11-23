import React, { useState, useEffect, useCallback, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import Swal from "sweetalert2";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import LoadingSpinner from "./Loading";
import { toast, ToastContainer } from "react-toastify";


const controller = new AbortController();

const DataBot = ({ serverData, usersCredential }) => {
  const [rowData, setRowData] = useState([]);
  const [newRowData, setNewRowData] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [formData, setFormData] = useState({
    id: 1,
    username: "",
    password: "",
    recovery: "",
    mac: "",
    rid: "",
    proxy: "",
    server: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("manual");

  useEffect(() => {
    document.title = "bot";
  }, []);

  const generateRID = () => {
    const characters = "0123456789ABCDEF";
    let rid = "";
    for (let i = 0; i < 32; i++) {
      rid += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return rid;
  };

  const generateMAC = () => {
    const mac = ["02"]; // Setting the first byte to 02
    for (let i = 0; i < 5; i++) {
      const octet = Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, "0");
      mac.push(octet);
    }
    return mac.join(":");
  };

  const countProxies = (rowData) => {
    const proxyCount = rowData.reduce((acc, user) => {
      const proxy = user.proxy;
      if (user.proxy !== "") {
        acc[proxy] = (acc[proxy] || 0) + 1;
      } else {
        acc[proxy] = 0;
      }

      return acc;
    }, {});

    return rowData.map((user) => ({
      ...user,
      proxyCount: proxyCount[user.proxy],
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const credentials = {
          username: usersCredential.username,
          password: usersCredential.password,
        };
        const response = await axios.get(
          "http://31.56.39.143:3000/view-bot-backup",
          {
            params: credentials,
          }
        );

        if (response.data.success) {
          const dataWithProxyCount = countProxies(response.data.botBackup);
          setRowData(dataWithProxyCount);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, []);

  const columnDefs = [
    {
      headerName: "Server",
      field: "server",
      editable: true,
      minWidth: 80,
      filter: "agSetColumnFilter",
    },
    {
      headerName: "Name",
      field: "username",
      editable: true,
      minWidth: 250,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Password",
      field: "password",
      editable: true,
      minWidth: 175,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Recovery",
      field: "recovery",
      editable: true,
      minWidth: 250,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "MAC",
      field: "mac",
      editable: true,
      minWidth: 150,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "RID",
      field: "rid",
      editable: true,
      minWidth: 300,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Proxy",
      field: "proxy",
      editable: true,
      minWidth: 200,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "#",
      field: "proxyCount",
      editable: true,
      minWidth: 100,
      filter: "agNumberColumnFilter",
      valueFormatter: (params) => "x" + params.value,
    },
  ];

  const onSelectionChanged = useCallback((event) => {
    const selectedIds = event.api.getSelectedRows().map((row) => row);
    setSelectedRowData(selectedIds);
    setSelectedRowIds(selectedIds.map((row) => row.id));
  }, []);

  const handleCellEditingStopped = useCallback(
    (event) => {
      const updatedData = rowData.map((row) =>
        row.id === event.data.id
          ? { ...row, [event.column.colId]: event.value }
          : row
      );
      setRowData(updatedData);
    },
    [rowData]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  function generateUniqueId() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const idLength = 12;
    let uniqueId = "";
    for (let i = 0; i < idLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      uniqueId += characters[randomIndex];
    }
    return uniqueId;
  }

  const submitData = async (event) => {
    event.preventDefault();

    const newBotData = {
      username: formData.username,
      password: formData.password,
      recovery: formData.recovery,
      mac: formData.mac || generateMAC(),
      rid: formData.rid || generateRID(),
      proxy: formData.proxy,
      id: generateUniqueId(),
      server: "",
    };

    const mapData = [...rowData, newBotData];

    const credentials = {
      username: usersCredential.username,
      password: usersCredential.password,
    };

    try {
      await axios.post("http://31.56.39.143:3000/add-bot-backup", {
        ...credentials,
        bots: [newBotData],
      });

      setRowData(mapData);
      toast.success("Bot added successfully!");
    } catch (error) {
      toast.error(`Failed to add bot to server: ${error.message}`);
    }
  };

  const removeData = async (serverIp) => {
    if (selectedRowIds.length === 0) {
      toast.warning("No data selected!");
      return;
    }

    const selectedLogRow = selectedRowIds.length;
    const mapRemovedData = rowData.filter((row) =>
      selectedRowIds.includes(row.id)
    );
    const mapNewestData = rowData.filter(
      (row) => !selectedRowIds.includes(row.id)
    );

    const credentials = {
      username: usersCredential.username,
      password: usersCredential.password,
    };

    const fetchPromise = mapRemovedData.map((item) =>
      axios.delete("http://31.56.39.143:3000/remove-bot-backup", {
        data: { ...credentials, botUsername: item.username },
      })
    );

    toast.promise(Promise.all(fetchPromise), {
      pending: `Deleting x${selectedLogRow} bots...`,
      success: "Bots deleted successfully!",
      error: "Failed to delete bots. Please try again.",
    });

    try {
      await Promise.all(fetchPromise);

      const dataWithProxyCount = countProxies(mapNewestData);
      setRowData(dataWithProxyCount);
    } catch (error) {
      console.error(error);
    }
  };

  const saveData = async () => {
    const selectedLogRow = selectedRowIds.length;
    const mapUpdatedData = rowData.filter((row) =>
      selectedRowIds.includes(row.id)
    );

    const credentials = {
      username: usersCredential.username,
      password: usersCredential.password,
    };
    const fetchPromise = rowData.map((item) => {
      return axios.put("http://31.56.39.143:3000/update-bot-backup", {
        ...credentials,
        botUsername: item.username,
        updatedData: item,
      });
    });

    toast.promise(Promise.all(fetchPromise), {
      pending: `Saving data...`,
      success: "Data saved successfully!",
      error: "Failed to save data. Please try again.",
    });

    try {
      await Promise.all(fetchPromise);
    } catch (error) {
      toast.error(`Failed to update data to server ${error.message}`);
    }
  };

  const rowSelection = useMemo(() => ({
    mode: "multiRow",
    checkboxes: true,
    headerCheckbox: true,
    enableClickSelection: true,
  }),[]);

  const gridOptions = {
    columnDefs: columnDefs,
    rowGroupPanelShow: 'always',
    defaultColDef: {
      filter: true,
      floatingFilter: true,
      menuTabs: ["generalMenuTab", "filterMenuTab", "columnsMenuTab"],
      enableRowGroup: true
    },
    columnMenu: "legacy",
    suppressMenuHide: true,
    statusBar: {
      statusPanels: [{ statusPanel: "agSelectedRowCountComponent" }],
    },
    autoGroupColumnDef: {
      minWidth: 200,
    }
  };

  const showModal = (data) => {
    if (data.length > 1) {
      Swal.fire({
        icon: "info",
        title: "Confirmation",
        text: `Confirm adding x${data.length} bots?`,
        showCancelButton: true,
        confirmButtonText: "Add Bots",
      }).then((result) => {
        if (result.isConfirmed) {
          AddBot(data);
        }
      });
    } else {
      const bot = data[0];
      Swal.fire({
        icon: "info",
        title: "Confirm Adding Bot",
        html: `
                Are you sure you want to add the following bot?
                <br>Name: <strong>${bot.username}</strong>
                <br>Password: <strong>${bot.password}</strong>
                <br>MAC: <strong>${bot.mac}</strong>
                <br>Recovery: <strong>${bot.recovery}</strong>
                <br>RID: <strong>${bot.rid}</strong>
                <br>Proxy: <strong>${bot.proxy}</strong>
                <br>Server: <strong>${bot.server}</strong>
            `,
        showCancelButton: true,
        confirmButtonText: "Add Bot",
      }).then((result) => {
        if (result.isConfirmed) {
          AddBot(data);
        }
      });
    }
  };

  const AddBot = async (data) => {
          // return axios.post(
      //   `http://${item.server}:8000/bot/runScript`,
      //   `
      //           local information = {
      //               ["name"] = "${item.username}",
      //               ["password"] = "${item.password}",
      //               ["mac"] = "${item.mac || ""}",
      //               ["rid"] = "${item.rid || ""}",
      //               ["proxy"] = "${item.proxy}",
      //               ["platform"] = "windows"
      //           }
      //           ${item.recovery && `information["recovery"] = ${item.recovery}`}
                
      //           addBot(information)
      //       `,
      //   {
      //     headers: {
      //       "Content-Type": "text/plain",
      //     },
      //   }
      // );

    const requests = data.map(async (item) => {
        await axios.post(
          `http://${item.server}:8000/bot/add`,
          null,
          {
            params: {
              name: item.username,
              password: item.password,
              recovery: item.recovery || "",
              mac: item.mac,
              rid: item.rid || "",
              proxy: item.proxy
            }
          }
      );
    });

    toast.promise(Promise.all(requests), {
      pending: `Adding bots...`,
      success: "Bots added to client",
      error: "Failed to add bots. Server offline?",
    });

    try {
      await Promise.all(requests);
    } catch (error) {
      console.error("Error adding bot:", error);
    }
  };

  const getContextMenuItems = (params) => [
    {
      name: "Save Data",
      action: () => {
        saveData();
      },
    },
    {
      name: "Add Bot",
      action: () => {
        showModal(selectedRowData);
      },
    },
    {
      name: "Set Server",
      action: async () => {
        const availableServers = serverData;

        // Show SweetAlert2 with a select dropdown
        const { value: selectedServer } = await Swal.fire({
          title: "Choose a server:",
          input: "select",
          inputOptions: availableServers.reduce((options, server) => {
            options[server] = server;
            return options;
          }, {}),
          inputPlaceholder: "Select a server",
          showCancelButton: true,
          confirmButtonText: "Set Server",
          cancelButtonText: "Cancel",
          customClass: {
            popup: "swal2-custom-select",
          },
        });

        if (selectedServer && availableServers.includes(selectedServer)) {
          // Get the selected rows
          const selectedNodes = params.api.getSelectedNodes();

          // Update the 'server' value for each selected row
          selectedNodes.forEach((node) => {
            node.setDataValue("server", selectedServer);
          });

          // Optionally, you can refresh the grid to reflect changes
          params.api.refreshCells({ force: true });
        }
      },
    },
    {
      name: "Remove",
      action: () => {
        removeData(params.node.data.serverIp);
      },
    },
    "separator",
    "copy",
  ];

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const isValidFormat = validateFileContent(content);

        if (isValidFormat) {
          const newRows = processFileContent(content);
          setNewRowData(newRows);
        } else {
          Swal.fire({
            title: "The Internet?",
            text: "File format is invalid. Please ensure it follows the format: USERNAME|PASSWORD|RECOVERY|MAC|RID|PROXY",
            icon: "warning",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const processFileContent = (content) => {
    const lines = content.split("\n");
    return lines.map((line, index) => {
      const parts = line.split("|");
      return {
        username: parts[0],
        password: parts[1],
        recovery: parts[2] || "",
        mac: parts[3] || generateMAC(),
        rid: parts[4] || generateRID(),
        proxy: parts[5] || "",
        id: generateUniqueId(),
        server: "",
      };
    });
  };

  const validateFileContent = (content) => {
    const lines = content.split("\n");
    return lines.every((line) => {
      const parts = line.split("|");
      return parts.length >= 3 && parts.length <= 6;
    });
  };

  const submitFileData = async (event) => {
    event.preventDefault();
    setRowData([...rowData, ...newRowData]);

    const credentials = {
      username: usersCredential.username,
      password: usersCredential.password,
    };
    const fetchPromise = axios.post("http://31.56.39.143:3000/add-bot-backup", {
      ...credentials,
      bots: newRowData,
    });

    toast.promise(fetchPromise, {
      pending: `Adding x${newRowData.length} bots...`,
      success: "Bot added to database succesfully!",
      error: "Failed to add bot to database. Please try again.",
    });

    try {
      await fetchPromise;
    } catch (error) {
      toast.error(`Failed to update data to server ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner loading={isLoading} />
      </div>
    );
  }

  return (
    <div className="p-6 bg-mainBg text-white min-h-screen overflow-x-hidden">
      <div className="bg-widgetBg p-2 rounded shadow-md mb-4">
        <div className="flex flex-row-reverse mb-2">
          <select
            id="input-option"
            name="inputOption"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className=" h-[35px] text-sm text-white bg-[#111827] border border-[#424242] rounded px-3 py-2"
          >
            <option value="manual">Manual</option>
            <option value="file">Upload</option>
          </select>
        </div>
        <form
          className="grid grid-cols-1 gap-6 mb-2 pad-2"
          onSubmit={submitData}
        >
          {selectedOption === "manual" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full h-[45px] text-white bg-[#111827] border border-[#424242] focus:ring-1 focus:outline-none font-medium rounded px-2.5 py-2.5"
                required
              />
              <input
                type="text"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full h-[45px] text-white bg-[#111827] border border-[#424242] focus:ring-1 focus:outline-none font-medium rounded text-sm px-2.5 py-2.5"
                required
              />
              <input
                type="text"
                name="recovery"
                placeholder="Recovery"
                value={formData.recovery}
                onChange={handleChange}
                className="w-full h-[45px] text-white bg-[#111827] border border-[#424242] focus:ring-1 focus:outline-none font-medium rounded text-sm px-2.5 py-2.5"
              />
              <input
                type="text"
                name="mac"
                placeholder="MAC"
                value={formData.mac}
                onChange={handleChange}
                className="w-full h-[45px] text-white bg-[#111827] border border-[#424242] focus:ring-1 focus:outline-none font-medium rounded text-sm px-2.5 py-2.5"
              />
              <input
                type="text"
                name="rid"
                placeholder="RID"
                value={formData.rid}
                onChange={handleChange}
                className="w-full h-[45px] text-white bg-[#111827] border border-[#424242] focus:ring-1 focus:outline-none font-medium rounded text-sm px-2.5 py-2.5"
              />
              <input
                type="text"
                name="proxy"
                placeholder="Proxy"
                value={formData.proxy}
                onChange={handleChange}
                className="w-full h-[45px] text-white bg-[#111827] border border-[#424242] focus:ring-1 focus:outline-none font-medium rounded text-sm px-2.5 py-2.5"
              />
              <div className="flex flex-row-reverse md:col-span-2 w-full gap-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-violet-500 hover:bg-violet-700 text-white text-sm py-1 px-2 rounded"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z" />
                  </svg>
                  Add
                </button>
              </div>
            </div>
          )}
        </form>

        {/* File Upload Form */}
        {selectedOption === "file" && (
          <form
            className="bg-[#111827] p-6 rounded-lg shadow-md"
            onSubmit={submitFileData}
          >
            <div className="mb-4">
              <label
                htmlFor="file-upload"
                className="block text-white font-medium mb-2"
              >
                Upload File:
              </label>
              <input
                type="file"
                id="file-upload"
                accept=".txt"
                onChange={handleFileChange}
                className="w-full h-[45px] text-white bg-[#1F2836] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="w-full bg-violet-500 hover:bg-violet-700 text-white py-3 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-violet-500 transition duration-300"
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
      <div className="overflow-x-auto max-w-full">
        <div className="ag-theme-quartz-dark h-[800px]">
          <AgGridReact
            gridOptions={gridOptions}
            rowData={rowData}
            getRowId={(params) => String(params.data.id)}
            getRowNodeId={(data) => data.id}
            rowSelection={rowSelection}
            onSelectionChanged={onSelectionChanged}
            onCellEditingStopped={handleCellEditingStopped}
            pagination
            paginationPageSize={100}
            getContextMenuItems={getContextMenuItems}
          />
        </div>
      </div>
      <ToastContainer position="bottom-center" autoClose={2000} theme="light" />
    </div>
  );
};

export default DataBot;
