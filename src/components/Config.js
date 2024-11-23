import axios from "axios";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "./Loading";
import { toast } from "react-toastify";

const Config = ({ serverData }) => {
  const [config, setConfig] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    document.title = "Config";
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises = serverData.map((server) =>
          axios.get(`http://${server}:8000/bot/config`).catch((error) => {
            console.error(error);
            toast.error("Failed to fetch data. Check network or server.");
            return null;
          })
        );
        const responses = await Promise.all(promises);
        setConfig(responses.map((res) => (res ? res.data : {})));
      } catch (error) {
        setError("Error fetching config data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner loading={loading} />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-violet-500">{error}</div>;
  }

  const updateConfig = async (index) => {
    const newScript = `${JSON.stringify(config[index], null, 2)}`; // Convert config object to JSON string

    try {
        const fetchPromise = axios.post(`http://${serverData[index]}:8000/bot/config`, newScript);
        
        toast.promise(fetchPromise, {
            pending: "Updating config...",
            success: "Config updated successfully!",
            error: "Failed update config. Please try again.",
        });

        const response = await fetchPromise;  

        return response;
    } catch (error) {
        console.error('Error updating config:', error);
        toast.error("An error occurred while updating the config.");
        throw error;
    }
  };

  const togglePanel = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="p-6 bg-mainBg text-white min-h-screen overflow-x-hidden">
      <div className="gap-6 mb-4 flex items-center justify-center">
        <div className="bg-widgetBg p-5 rounded-lg shadow-md w-full">
          <div id="accordion-arrow-icon" className="mb-4">
            {config.map((item, index) => (
              <div key={index}>
                <h2 id={`accordion-arrow-icon-heading-${index}`}>
                  <button
                    type="button"
                    className="flex items-center justify-between w-full p-4 md:p-5 font-medium text-white bg-[#111827] border border-b-0 border-gray-700 hover:bg-[#111827] gap-3"
                    onClick={() => togglePanel(index)}
                    aria-expanded={activeIndex === index ? "true" : "false"}
                    aria-controls={`accordion-arrow-icon-body-${index}`}
                  >
                    <span className="text-sm md:text-base">
                     🎯 Farming config for server - {index + 1}
                    </span>
                  </button>
                </h2>
                {activeIndex === index && (
                  <div
                    id={`accordion-arrow-icon-body-${index}`}
                    className="p-5 border border-b-2 border-gray-700"
                  >
                    <ul className="text-sm text-gray-300">
                      <form>
                        {/* Farming settings */}
                        <div className="mb-8 p-5 bg-mainBg text-white  overflow-x-hidden rounded-lg">
                          <p className="text-center text-lg font-bold text-gray-300 uppercase">
                            farming settings
                          </p>
                          <div className="flex mb-4 gap-4">
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                Farming State
                              </p>
                              <select
                                value={item.farming_state}
                                onChange={(e) => {
                                  const newData = [...config];
                                  newData[index] = {
                                    ...newData[index],
                                    farming_state: e.target.value,
                                  };
                                  setConfig(newData);
                                }}
                                className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2"
                              >
                                <option value="RESUME">RESUME</option>
                                <option value="PAUSED">PAUSED</option>
                              </select>
                            </div>
                          </div>
                          <div className="flex mb-4 gap-4">
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                World List
                              </p>
                              <input
                                type="text"
                                value={item.world_list}
                                onChange={(e) => {
                                  const newData = [...config];
                                  newData[index] = {
                                    ...newData[index],
                                    world_list: e.target.value,
                                  };
                                  setConfig(newData);
                                }}
                                className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2"
                              />
                            </div>
                          </div>
                          <div className="flex mb-4 gap-4">
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                Move Interval
                              </p>
                              <div className="w-full">
                                <input
                                  type="number"
                                  value={item.move_interval}
                                  onChange={(e) => {
                                    const newData = [...config];
                                    newData[index] = {
                                      ...newData[index],
                                      move_interval: parseInt(e.target.value),
                                    };
                                    setConfig(newData);
                                  }}
                                  className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                Move Range
                              </p>
                              <div className="w-full">
                                <input
                                  type="number"
                                  value={item.move_range}
                                  onChange={(e) => {
                                    const newData = [...config];
                                    newData[index] = {
                                      ...newData[index],
                                      move_interval: parseInt(e.target.value),
                                    };
                                    setConfig(newData);
                                  }}
                                  className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex mb-4 gap-4">
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                Item Id
                              </p>
                              <div className="w-full">
                                <input
                                  type="number"
                                  value={item.item_id}
                                  onChange={(e) => {
                                    const newData = [...config];
                                    newData[index] = {
                                      ...newData[index],
                                      item_id: parseInt(e.target.value),
                                    };
                                    setConfig(newData);
                                  }}
                                  className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                Item Seed
                              </p>
                              <div className="w-full">
                                <input
                                  type="number"
                                  value={item.item_seed}
                                  onChange={(e) => {
                                    const newData = [...config];
                                    newData[index] = {
                                      ...newData[index],
                                      move_interval: parseInt(e.target.value),
                                    };
                                    setConfig(newData);
                                  }}
                                  className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex mb-4 gap-4">
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                Animation
                              </p>
                              <div className="inline-flex items-center">
                                <label className="flex items-center cursor-pointer relative">
                                  <input
                                    type="checkbox"
                                    checked={item.show_animation}
                                    onChange={(e) => {
                                      const newData = [...config];
                                      newData[index] = {
                                        ...newData[index],
                                        show_animation: e.target.checked,
                                      };
                                      setConfig(newData);
                                    }}
                                    className="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-400 checked:bg-violet-600 checked:border-slate-800"
                                    id="check"
                                  />
                                  <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3.5 w-3.5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      stroke="currentColor"
                                      strokeWidth="1"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      ></path>
                                    </svg>
                                  </span>
                                </label>
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                Fresh Bot
                              </p>
                              <div className="inline-flex items-center">
                                <label className="flex items-center cursor-pointer relative">
                                  <input
                                    type="checkbox"
                                    checked={item.fresh_bot}
                                    onChange={(e) => {
                                      const newData = [...config];
                                      newData[index] = {
                                        ...newData[index],
                                        fresh_bot: e.target.checked,
                                      };
                                      setConfig(newData);
                                    }}
                                    className="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-400 checked:bg-violet-600 checked:border-slate-800"
                                    id="check"
                                  />
                                  <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3.5 w-3.5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      stroke="currentColor"
                                      strokeWidth="1"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      ></path>
                                    </svg>
                                  </span>
                                </label>
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                Auto Fill
                              </p>
                              <div className="inline-flex items-center">
                                <label className="flex items-center cursor-pointer relative">
                                  <input
                                    type="checkbox"
                                    checked={item.auto_fill}
                                    onChange={(e) => {
                                      const newData = [...config];
                                      newData[index] = {
                                        ...newData[index],
                                        auto_fill: e.target.checked,
                                      };
                                      setConfig(newData);
                                    }}
                                    className="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-400 checked:bg-violet-600 checked:border-slate-800"
                                    id="check"
                                  />
                                  <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3.5 w-3.5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      stroke="currentColor"
                                      strokeWidth="1"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      ></path>
                                    </svg>
                                  </span>
                                </label>
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                Take Pickaxe
                              </p>
                              <div className="inline-flex items-center">
                                <label className="flex items-center cursor-pointer relative">
                                  <input
                                    type="checkbox"
                                    checked={item.take_pickaxe}
                                    onChange={(e) => {
                                      const newData = [...config];
                                      newData[index] = {
                                        ...newData[index],
                                        take_pickaxe: e.target.checked,
                                      };
                                      setConfig(newData);
                                    }}
                                    className="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-400 checked:bg-violet-600 checked:border-slate-800"
                                    id="check"
                                  />
                                  <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3.5 w-3.5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      stroke="currentColor"
                                      strokeWidth="1"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      ></path>
                                    </svg>
                                  </span>
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="flex mb-4 gap-4">
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                Storage Seed
                              </p>
                              <div className="w-full">
                                <textarea
                                  name="storage_seed_list"
                                  value={
                                    item?.storage_seed_list?.join("\r\n") || ""
                                  }
                                  onChange={(e) => {
                                    const newList =
                                      e.target.value.split("\r\n");
                                    const newData = [...config];
                                    newData[index] = {
                                      ...newData[index],
                                      storage_seed_list: newList,
                                    };
                                    setConfig(newData);
                                  }}
                                  className="w-full h-[250px] bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                Storage Pack
                              </p>
                              <div className="w-full">
                                <textarea
                                  name="storage_pack_list"
                                  value={
                                    item?.storage_pack_list?.join("\r\n") || ""
                                  }
                                  onChange={(e) => {
                                    const newList =
                                      e.target.value.split("\r\n");
                                    const newData = [...config];
                                    newData[index] = {
                                      ...newData[index],
                                      storage_pack_list: newList,
                                    };
                                    setConfig(newData);
                                  }}
                                  className="w-full h-[250px] bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex mb-4 gap-4">
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                Storage Item
                              </p>
                              <div className="w-full">
                                <textarea
                                  name="storage_item_list"
                                  value={
                                    item?.storage_item_list?.join("\r\n") || ""
                                  }
                                  onChange={(e) => {
                                    const newList =
                                      e.target.value.split("\r\n");
                                    const newData = [...config];
                                    newData[index] = {
                                      ...newData[index],
                                      storage_item_list: newList,
                                    };
                                    setConfig(newData);
                                  }}
                                  className="w-full h-[100px] bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                Storage vile
                              </p>
                              <div className="w-full">
                                <textarea
                                  name="storage_vile_list"
                                  value={
                                    item?.storage_vile_list?.join("\r\n") || ""
                                  }
                                  onChange={(e) => {
                                    const newList =
                                      e.target.value.split("\r\n");
                                    const newData = [...config];
                                    newData[index] = {
                                      ...newData[index],
                                      storage_vile_list: newList,
                                    };
                                    setConfig(newData);
                                  }}
                                  className="w-full h-[100px] bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex mb-4 gap-4">
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                Harvest Interval
                              </p>
                              <input
                                type="number"
                                value={item.interval.harvest || ""}
                                onChange={(e) => {
                                  const newData = [...config];
                                  newData[index] = {
                                    ...newData[index],
                                    interval: {
                                      ...newData[index].interval,
                                      harvest: parseInt(e.target.value),
                                    },
                                  };
                                  setConfig(newData);
                                }}
                                className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                Plant Interval
                              </p>
                              <input
                                type="number"
                                value={item.interval.plant || ""}
                                onChange={(e) => {
                                  const newData = [...config];
                                  newData[index] = {
                                    ...newData[index],
                                    interval: {
                                      ...newData[index].interval,
                                      plant: parseInt(e.target.value),
                                    },
                                  };
                                  setConfig(newData);
                                }}
                                className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                punch Interval
                              </p>
                              <input
                                type="number"
                                value={item.interval.punch || ""}
                                onChange={(e) => {
                                  const newData = [...config];
                                  newData[index] = {
                                    ...newData[index],
                                    interval: {
                                      ...newData[index].interval,
                                      punch: parseInt(e.target.value),
                                    },
                                  };
                                  setConfig(newData);
                                }}
                                className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                punch Interval
                              </p>
                              <input
                                type="number"
                                value={item.interval.place || ""}
                                onChange={(e) => {
                                  const newData = [...config];
                                  newData[index] = {
                                    ...newData[index],
                                    interval: {
                                      ...newData[index].interval,
                                      place: parseInt(e.target.value),
                                    },
                                  };
                                  setConfig(newData);
                                }}
                                className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2"
                              />
                            </div>
                          </div>
                          <div className="flex mb-4 gap-4">
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                warp delay
                              </p>
                              <div className="w-full">
                                <input
                                  type="number"
                                  value={item.interval.warp}
                                  onChange={(e) => {
                                    const newData = [...config];
                                    newData[index] = {
                                      ...newData[index],
                                      interval: {
                                        ...newData[index].interval,
                                        warp: parseInt(e.target.value),
                                      },
                                    };
                                    setConfig(newData);
                                  }}
                                  className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                connect delay
                              </p>
                              <div className="w-full">
                                <input
                                  type="number"
                                  value={item.interval.connect}
                                  onChange={(e) => {
                                    const newData = [...config];
                                    newData[index] = {
                                      ...newData[index],
                                      interval: {
                                        ...newData[index].interval,
                                        connect: parseInt(e.target.value),
                                      },
                                    };
                                    setConfig(newData);
                                  }}
                                  className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                execute delay
                              </p>
                              <div className="w-full">
                                <input
                                  type="number"
                                  value={item.interval.execute}
                                  onChange={(e) => {
                                    const newData = [...config];
                                    newData[index] = {
                                      ...newData[index],
                                      interval: {
                                        ...newData[index].interval,
                                        execute: parseInt(e.target.value),
                                      },
                                    };
                                    setConfig(newData);
                                  }}
                                  className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex mb-4 gap-4">
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                custom break tile
                              </p>
                              <div className="inline-flex items-center">
                                <label className="flex items-center cursor-pointer relative">
                                  <input
                                    type="checkbox"
                                    checked={item.custom_tile}
                                    onChange={(e) => {
                                      const newData = [...config];
                                      newData[index] = {
                                        ...newData[index],
                                        custom_tile: e.target.checked,
                                      };
                                      setConfig(newData);
                                    }}
                                    className="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-400 checked:bg-violet-600 checked:border-slate-800"
                                    id="check"
                                  />
                                  <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3.5 w-3.5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      stroke="currentColor"
                                      strokeWidth="1"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      ></path>
                                    </svg>
                                  </span>
                                </label>
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                pnb in home
                              </p>
                              <div className="inline-flex items-center">
                                <label className="flex items-center cursor-pointer relative">
                                  <input
                                    type="checkbox"
                                    checked={item.pnb_home_world}
                                    onChange={(e) => {
                                      const newData = [...config];
                                      newData[index] = {
                                        ...newData[index],
                                        pnb_home_world: e.target.checked,
                                      };
                                      setConfig(newData);
                                    }}
                                    className="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-400 checked:bg-violet-600 checked:border-slate-800"
                                    id="check"
                                  />
                                  <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3.5 w-3.5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      stroke="currentColor"
                                      strokeWidth="1"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      ></path>
                                    </svg>
                                  </span>
                                </label>
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                pnb in otherworld
                              </p>
                              <div className="inline-flex items-center">
                                <label className="flex items-center cursor-pointer relative">
                                  <input
                                    type="checkbox"
                                    checked={item.pnb_other_world}
                                    onChange={(e) => {
                                      const newData = [...config];
                                      newData[index] = {
                                        ...newData[index],
                                        pnb_other_world: e.target.checked,
                                      };
                                      setConfig(newData);
                                    }}
                                    className="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-400 checked:bg-violet-600 checked:border-slate-800"
                                    id="check"
                                  />
                                  <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3.5 w-3.5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      stroke="currentColor"
                                      strokeWidth="1"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      ></path>
                                    </svg>
                                  </span>
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="flex mb-4 gap-4">
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                world break list
                              </p>
                              <div className="w-full">
                                <input
                                  type="text"
                                  value={item.world_list_pnb}
                                  onChange={(e) => {
                                    const newData = [...config];
                                    newData[index] = {
                                      ...newData[index],
                                      world_list_pnb: e.target.value,
                                    };
                                    setConfig(newData);
                                  }}
                                  className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex mb-4 gap-4">
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                custom x
                              </p>
                              <div className="w-full">
                                <input
                                  type="number"
                                  value={item.custom_x}
                                  onChange={(e) => {
                                    const newData = [...config];
                                    newData[index] = {
                                      ...newData[index],
                                      custom_x: parseInt(e.target.value),
                                    };
                                    setConfig(newData);
                                  }}
                                  className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                custom y
                              </p>
                              <div className="w-full">
                                <input
                                  type="number"
                                  value={item.custom_y}
                                  onChange={(e) => {
                                    const newData = [...config];
                                    newData[index] = {
                                      ...newData[index],
                                      custom_y: e.target.value,
                                    };
                                    setConfig(newData);
                                  }}
                                  className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                tile number
                              </p>
                              <div className="w-full">
                                <input
                                  type="number"
                                  value={item.tile_number}
                                  onChange={(e) => {
                                    const newData = [...config];
                                    newData[index] = {
                                      ...newData[index],
                                      tile_number: e.target.value,
                                    };
                                    setConfig(newData);
                                  }}
                                  className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Malady settings */}
                        <div className="mb-8 p-5 bg-mainBg text-white  overflow-x-hidden rounded-lg">
                          <p className="text-center text-lg font-bold text-gray-300 mb-4 uppercase">
                            malady settings
                          </p>
                          <div className="flex mb-4 gap-4">
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                enable malady
                              </p>
                              <div className="inline-flex items-center">
                                <label className="flex items-center cursor-pointer relative">
                                  <input
                                    type="checkbox"
                                    checked={item.malady.enable}
                                    onChange={(e) => {
                                      const newData = [...config];
                                      newData[index] = {
                                        ...newData[index],
                                        malady: {
                                          ...newData[index].malady,
                                          enable: e.target.checked,
                                        },
                                      };
                                      setConfig(newData);
                                    }}
                                    className="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-400 checked:bg-violet-600 checked:border-slate-800"
                                    id="check"
                                  />
                                  <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3.5 w-3.5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      stroke="currentColor"
                                      strokeWidth="1"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      ></path>
                                    </svg>
                                  </span>
                                </label>
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                enable infecting
                              </p>
                              <div className="inline-flex items-center">
                                <label className="flex items-center cursor-pointer relative">
                                  <input
                                    type="checkbox"
                                    checked={item.malady.infect}
                                    onChange={(e) => {
                                      const newData = [...config];
                                      newData[index] = {
                                        ...newData[index],
                                        malady: {
                                          ...newData[index].malady,
                                          infect: e.target.checked,
                                        },
                                      };
                                      setConfig(newData);
                                    }}
                                    className="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-400 checked:bg-violet-600 checked:border-slate-800"
                                    id="check"
                                  />
                                  <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3.5 w-3.5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      stroke="currentColor"
                                      strokeWidth="1"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      ></path>
                                    </svg>
                                  </span>
                                </label>
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                vial item id
                              </p>
                              <div className="w-full">
                                <input
                                  type="number"
                                  value={item.malady.id}
                                  onChange={(e) => {
                                    const newData = [...config];
                                    newData[index] = {
                                      ...newData[index],
                                      malady: {
                                        ...newData[index].malady,
                                        id: parseInt(e.target.value),
                                      },
                                    };
                                    setConfig(newData);
                                  }}
                                  className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                              </div>
                            </div>
                          </div>
                          <p className="text-center text-lg font-bold text-gray-300 mb-4 uppercase">
                            torn settings
                          </p>
                          <div className="flex mb-4 gap-4">
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                torn surgery world
                              </p>
                              <div className="w-full">
                                <input
                                  type="text"
                                  value={item.malady.location["1"].world}
                                  onChange={(e) => {
                                    const newData = [...config];
                                    newData[index] = {
                                      ...newData[index],
                                      malady: {
                                        ...newData[index].malady,
                                        location: {
                                          ...newData[index].malady.location,
                                          1: {
                                            ...newData[index].malady.location[
                                              "1"
                                            ],
                                            world: e.target.value,
                                          },
                                        },
                                      },
                                    };
                                    setConfig(newData);
                                  }}
                                  className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                torn surgery x position
                              </p>
                              <div className="w-full">
                                <input
                                  type="number"
                                  value={item.malady.location["1"].x}
                                  onChange={(e) => {
                                    const newData = [...config];
                                    newData[index] = {
                                      ...newData[index],
                                      malady: {
                                        ...newData[index].malady,
                                        location: {
                                          ...newData[index].malady.location,
                                          1: {
                                            ...newData[index].malady.location[
                                              "1"
                                            ],
                                            x: e.target.value,
                                          },
                                        },
                                      },
                                    };
                                    setConfig(newData);
                                  }}
                                  className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                torn surgery y position
                              </p>
                              <div className="w-full">
                                <input
                                  type="number"
                                  value={item.malady.location["1"].y}
                                  onChange={(e) => {
                                    const newData = [...config];
                                    newData[index] = {
                                      ...newData[index],
                                      malady: {
                                        ...newData[index].malady,
                                        location: {
                                          ...newData[index].malady.location,
                                          1: {
                                            ...newData[index].malady.location[
                                              "1"
                                            ],
                                            y: e.target.value,
                                          },
                                        },
                                      },
                                    };
                                    setConfig(newData);
                                  }}
                                  className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                              </div>
                            </div>
                          </div>

                          <p className="text-center text-lg font-bold text-gray-300 mb-4 uppercase">
                            gems cut settings
                          </p>
                          <div className="flex mb-4 gap-4">
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                gems cut surgery world
                              </p>
                              <div className="w-full">
                                <input
                                  type="text"
                                  value={item.malady.location["2"].world}
                                  onChange={(e) => {
                                    const newData = [...config];
                                    newData[index] = {
                                      ...newData[index],
                                      malady: {
                                        ...newData[index].malady,
                                        location: {
                                          ...newData[index].malady.location,
                                          2: {
                                            ...newData[index].malady.location[
                                              "2"
                                            ],
                                            world: e.target.value,
                                          },
                                        },
                                      },
                                    };
                                    setConfig(newData);
                                  }}
                                  className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                gems cut surgery x position
                              </p>
                              <div className="w-full">
                                <input
                                  type="number"
                                  value={item.malady.location["2"].x}
                                  onChange={(e) => {
                                    const newData = [...config];
                                    newData[index] = {
                                      ...newData[index],
                                      malady: {
                                        ...newData[index].malady,
                                        location: {
                                          ...newData[index].malady.location,
                                          2: {
                                            ...newData[index].malady.location[
                                              "2"
                                            ],
                                            x: e.target.value,
                                          },
                                        },
                                      },
                                    };
                                    setConfig(newData);
                                  }}
                                  className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                gems cut surgery y position
                              </p>
                              <div className="w-full">
                                <input
                                  type="number"
                                  value={item.malady.location["2"].y}
                                  onChange={(e) => {
                                    const newData = [...config];
                                    newData[index] = {
                                      ...newData[index],
                                      malady: {
                                        ...newData[index].malady,
                                        location: {
                                          ...newData[index].malady.location,
                                          2: {
                                            ...newData[index].malady.location[
                                              "2"
                                            ],
                                            y: e.target.value,
                                          },
                                        },
                                      },
                                    };
                                    setConfig(newData);
                                  }}
                                  className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Auto rest settings */}
                        <div className="mb-10 p-5 bg-mainBg text-white overflow-x-hidden rounded-lg">
                          <p className="text-center text-lg font-bold text-gray-300 mb-4 uppercase">
                            auto rest settings
                          </p>
                          <div className="flex mb-4 gap-4">
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                enable auto rest
                              </p>
                              <div className="inline-flex items-center">
                                <label className="flex items-center cursor-pointer relative">
                                  <input
                                    type="checkbox"
                                    checked={item.auto_rest.enable}
                                    onChange={(e) => {
                                      const newData = [...config];
                                      newData[index] = {
                                        ...newData[index],
                                        auto_rest: {
                                          ...newData[index].auto_rest,
                                          enable: e.target.checked,
                                        },
                                      };
                                      setConfig(newData);
                                    }}
                                    className="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-400 checked:bg-violet-600 checked:border-slate-800"
                                    id="check"
                                  />
                                  <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3.5 w-3.5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      stroke="currentColor"
                                      strokeWidth="1"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      ></path>
                                    </svg>
                                  </span>
                                </label>
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                disconnect on rest
                              </p>
                              <div className="inline-flex items-center">
                                <label className="flex items-center cursor-pointer relative">
                                  <input
                                    type="checkbox"
                                    checked={item.auto_rest.disconnect_rest}
                                    onChange={(e) => {
                                      const newData = [...config];
                                      newData[index] = {
                                        ...newData[index],
                                        auto_rest: {
                                          ...newData[index].auto_rest,
                                          disconnect_rest: e.target.checked,
                                        },
                                      };
                                      setConfig(newData);
                                    }}
                                    className="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-400 checked:bg-violet-600 checked:border-slate-800"
                                    id="check"
                                  />
                                  <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3.5 w-3.5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      stroke="currentColor"
                                      strokeWidth="1"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      ></path>
                                    </svg>
                                  </span>
                                </label>
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                auto rest duration
                              </p>
                              <div className="w-full">
                                <input
                                  type="number"
                                  value={item.auto_rest.duration}
                                  onChange={(e) => {
                                    const newData = [...config];
                                    newData[index] = {
                                      ...newData[index],
                                      auto_rest: {
                                        ...newData[index].auto_rest,
                                        duration: parseInt(e.target.value),
                                      },
                                    };
                                    setConfig(newData);
                                  }}
                                  className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                auto rest interval
                              </p>
                              <div className="w-full">
                                <input
                                  type="number"
                                  value={item.auto_rest.interval}
                                  onChange={(e) => {
                                    const newData = [...config];
                                    newData[index] = {
                                      ...newData[index],
                                      auto_rest: {
                                        ...newData[index].auto_rest,
                                        interval: parseInt(e.target.value),
                                      },
                                    };
                                    setConfig(newData);
                                  }}
                                  className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Auto wear settings */}
                        <div className="mb-10 p-5 bg-mainBg text-white overflow-x-hidden rounded-lg">
                          <p className="text-center text-lg font-bold text-gray-300 mb-4 uppercase">
                            auto wear settings
                          </p>
                          <div className="flex mb-4 gap-4">
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                enable auto wear
                              </p>
                              <div className="inline-flex items-center">
                                <label className="flex items-center cursor-pointer relative">
                                  <input
                                    type="checkbox"
                                    checked={item.auto_wear.enable}
                                    onChange={(e) => {
                                      const newData = [...config];
                                      newData[index] = {
                                        ...newData[index],
                                        auto_wear: {
                                          ...newData[index].auto_wear,
                                          enable: e.target.checked,
                                        },
                                      };
                                      setConfig(newData);
                                    }}
                                    className="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-400 checked:bg-violet-600 checked:border-slate-800"
                                    id="check"
                                  />
                                  <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3.5 w-3.5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      stroke="currentColor"
                                      strokeWidth="1"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      ></path>
                                    </svg>
                                  </span>
                                </label>
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                enable auto buy item
                              </p>
                              <div className="inline-flex items-center">
                                <label className="flex items-center cursor-pointer relative">
                                  <input
                                    type="checkbox"
                                    checked={item.auto_wear.buy.enable}
                                    onChange={(e) => {
                                      const newData = [...config];
                                      newData[index] = {
                                        ...newData[index],
                                        auto_wear: {
                                          ...newData[index].auto_wear,
                                          buy: {
                                            ...newData[index].auto_wear.buy,
                                            enable: e.target.checked,
                                          },
                                        },
                                      };
                                      setConfig(newData);
                                    }}
                                    className="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-400 checked:bg-violet-600 checked:border-slate-800"
                                    id="check"
                                  />
                                  <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3.5 w-3.5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      stroke="currentColor"
                                      strokeWidth="1"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      ></path>
                                    </svg>
                                  </span>
                                </label>
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                auto wear buy price
                              </p>
                              <div className="w-full">
                                <input
                                  type="number"
                                  value={item.auto_wear.buy.price}
                                  onChange={(e) => {
                                    const newData = [...config];
                                    newData[index] = {
                                      ...newData[index],
                                      auto_wear: {
                                        ...newData[index].auto_wear,
                                        buy: {
                                          ...newData[index].auto_wear.buy,
                                          price: parseInt(e.target.value),
                                        },
                                      },
                                    };
                                    setConfig(newData);
                                  }}
                                  className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                auto wear item id
                              </p>
                              <div className="w-full">
                                <input
                                  type="number"
                                  value={item.auto_wear.id}
                                  onChange={(e) => {
                                    const newData = [...config];
                                    newData[index] = {
                                      ...newData[index],
                                      auto_wear: {
                                        ...newData[index].auto_wear,
                                        buy: {
                                          ...newData[index].auto_wear.buy,
                                          id: parseInt(e.target.value),
                                        },
                                      },
                                    };
                                    setConfig(newData);
                                  }}
                                  className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Purchase settings */}
                        <div className="mb-10 p-5 bg-mainBg text-white overflow-x-hidden rounded-lg">
                          <p className="text-center text-lg font-bold text-gray-300 mb-4 uppercase">
                            purchase settings
                          </p>
                          <div className="flex mb-4 gap-4">
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                debug name
                              </p>
                              <div className="w-full">
                                <input
                                  type="text"
                                  value={item.purchase.name}
                                  onChange={(e) => {
                                    const newData = [...config];
                                    newData[index] = {
                                      ...newData[index],
                                      purchase: {
                                        ...newData[index].purchase,
                                        name: String(e.target.value),
                                      },
                                    };
                                    setConfig(newData);
                                  }}
                                  className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                item list id
                              </p>
                              <div className="w-full">
                                <input
                                  type="text"
                                  value={
                                    item.purchase.list
                                      .map((item) => `${item}`)
                                      .join(",") || ""
                                  }
                                  onChange={(e) => {
                                    const newList = e.target.value
                                      .split(",")
                                      .map((item) => item.trim());

                                    const newData = [...config];
                                    newData[index] = {
                                      ...newData[index],
                                      purchase: {
                                        ...newData[index].purchase,
                                        list: newList,
                                      },
                                    };
                                    setConfig(newData);
                                  }}
                                  className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                purchase price
                              </p>
                              <div className="w-full">
                                <input
                                  type="number"
                                  value={item.purchase.price}
                                  onChange={(e) => {
                                    const newData = [...config];
                                    newData[index] = {
                                      ...newData[index],
                                      purchase: {
                                        ...newData[index].purchase,
                                        price: parseInt(e.target.value),
                                      },
                                    };
                                    setConfig(newData);
                                  }}
                                  className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                minimum gems
                              </p>
                              <div className="w-full">
                                <input
                                  type="number"
                                  value={item.purchase.minimum_gem}
                                  onChange={(e) => {
                                    const newData = [...config];
                                    newData[index] = {
                                      ...newData[index],
                                      purchase: {
                                        ...newData[index].purchase,
                                        minimum_gem: parseInt(e.target.value),
                                      },
                                    };
                                    setConfig(newData);
                                  }}
                                  className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Auto event settings */}
                        <div className="mb-10 p-5 bg-mainBg text-white overflow-x-hidden rounded-lg">
                          <p className="text-center text-lg font-bold text-gray-300 mb-4 uppercase">
                            auto event settings
                          </p>
                          <div className="flex mb-4 gap-4">
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                enable auto event
                              </p>
                              <div className="inline-flex items-center">
                                <label className="flex items-center cursor-pointer relative">
                                  <input
                                    type="checkbox"
                                    checked={item.event.enable}
                                    onChange={(e) => {
                                      const newData = [...config];
                                      newData[index] = {
                                        ...newData[index],
                                        event: {
                                          ...newData[index].event,
                                          enable: e.target.checked,
                                        },
                                      };
                                      setConfig(newData);
                                    }}
                                    className="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-400 checked:bg-violet-600 checked:border-slate-800"
                                    id="check"
                                  />
                                  <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3.5 w-3.5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      stroke="currentColor"
                                      strokeWidth="1"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      ></path>
                                    </svg>
                                  </span>
                                </label>
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                world event
                              </p>
                              <div className="w-full">
                                <input
                                  type="text"
                                  value={item.event.world}
                                  onChange={(e) => {
                                    const newData = [...config];
                                    newData[index] = {
                                      ...newData[index],
                                      event: {
                                        ...newData[index].event,
                                        world: String(e.target.value),
                                      },
                                    };
                                    setConfig(newData);
                                  }}
                                  className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                              </div>
                            </div>
                            <div className="flex mb-4 gap-4">
                              <div className="flex-1">
                                <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                  webhook url event
                                </p>
                                <div className="w-full">
                                  <input
                                    type="text"
                                    value={item.event.webhook.url}
                                    onChange={(e) => {
                                      const newData = [...config];
                                      newData[index] = {
                                        ...newData[index],
                                        event: {
                                          ...newData[index].event,
                                          webhook: {
                                            ...newData[index].event.webhook,
                                            url: e.target.value,
                                          },
                                        },
                                      };
                                      setConfig(newData);
                                    }}
                                    className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                  />
                                </div>
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                  webhook id event
                                </p>
                                <div className="w-full">
                                  <input
                                    type="text"
                                    value={item.event.webhook.id}
                                    onChange={(e) => {
                                      const newData = [...config];
                                      newData[index] = {
                                        ...newData[index],
                                        event: {
                                          ...newData[index].event,
                                          webhook: {
                                            ...newData[index].event.webhook,
                                            id: e.target.value,
                                          },
                                        },
                                      };
                                      setConfig(newData);
                                    }}
                                    className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mb-4 gap-4">
                            <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                              auto event item id
                            </p>

                            <div className="flex mb-2 items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setIsCollapsed(!isCollapsed)} // Toggle collapse state
                                className="flex items-center mb-4 text-white bg-blue-600 hover:bg-blue-600 focus:ring-1 focus:outline-none font-medium rounded text-sm w-full px-2.5 py-2.5 text-center"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="size-5 mr-2"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M11.47 4.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1-1.06 1.06L12 6.31 8.78 9.53a.75.75 0 0 1-1.06-1.06l3.75-3.75Zm-3.75 9.75a.75.75 0 0 1 1.06 0L12 17.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0l-3.75-3.75a.75.75 0 0 1 0-1.06Z"
                                    clipRule="evenodd"
                                  />
                                </svg>

                                {isCollapsed ? "Expand" : "Collapse"}
                              </button>
                              <button
                                type="button"
                                className="flex items-center mb-4 text-white bg-green-600 hover:bg-green-800 focus:ring-1 focus:outline-none font-medium rounded text-sm w-full px-2.5 py-2.5 text-center"
                                onClick={() => {
                                  const newItem = { id: 0, count: 0 }; // Define the new item's structure
                                  const newList = [...item.event.list, newItem];
                                  const newData = [...config];

                                  newData[index] = {
                                    ...newData[index],
                                    event: {
                                      ...newData[index].event,
                                      list: newList,
                                    },
                                  };
                                  setConfig(newData);
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="size-5 mr-2"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Add item id
                              </button>
                            </div>
                            {!isCollapsed &&
                              item.event.list.map((itm, idx) => (
                                <div
                                  key={itm.id}
                                  className="flex mb-2 items-center gap-2"
                                >
                                  <div className="w-5px bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow">
                                    {idx + 1}
                                  </div>
                                  :
                                  <input
                                    type="number"
                                    value={itm.id}
                                    onChange={(e) => {
                                      const newId = parseInt(e.target.value);
                                      const newList = [...item.event.list];
                                      const newData = [...config];

                                      newList[idx] = {
                                        ...newList[idx],
                                        id: newId,
                                      };

                                      newData[index] = {
                                        ...newData[index],
                                        event: {
                                          ...newData[index].event,
                                          list: newList,
                                        },
                                      };
                                      setConfig(newData);
                                    }}
                                    className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                  />
                                  <input
                                    type="number"
                                    value={itm.count}
                                    onChange={(e) => {
                                      const newCount = parseInt(e.target.value);
                                      const newList = [...item.event.list];
                                      const newData = [...config];

                                      newList[idx] = {
                                        ...newList[idx],
                                        count: newCount,
                                      };

                                      newData[index] = {
                                        ...newData[index],
                                        event: {
                                          ...newData[index].event,
                                          list: newList,
                                        },
                                      };
                                      setConfig(newData);
                                    }}
                                    className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                  />
                                  <button
                                    type="button"
                                    className="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm w-full sm:w-auto px-2.5 py-2.5 text-center"
                                    onClick={() => {
                                      const newList = item.event.list.filter(
                                        (_, i) => i !== index
                                      );
                                      const newData = [...config];

                                      newData[index] = {
                                        ...newData[index],
                                        event: {
                                          ...newData[index].event,
                                          list: newList,
                                        },
                                      };
                                      setConfig(newData);
                                    }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                      className="size-4"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              ))}
                          </div>
                        </div>

                        {/* Webhook settings */}
                        <div className="mb-10 p-5 bg-mainBg text-white overflow-x-hidden rounded-lg">
                          <p className="text-center text-lg font-bold text-gray-300 mb-4 uppercase">
                            webhook settings
                          </p>
                          <div className="flex mb-4 gap-4">
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                daily info
                              </p>
                              <div className="w-full">
                                <input
                                  type="text"
                                  value={item.webhook.info}
                                  onChange={(e) => {
                                    const newData = [...config];
                                    newData[index] = {
                                      ...newData[index],
                                      webhook: {
                                        ...newData[index].webhook,
                                        info: String(e.target.value),
                                      },
                                    };
                                    setConfig(newData);
                                  }}
                                  className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex mb-4 gap-4">
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                pack info
                              </p>
                              <div className="w-full">
                                <input
                                  type="text"
                                  value={item.webhook.pack}
                                  onChange={(e) => {
                                    const newData = [...config];
                                    newData[index] = {
                                      ...newData[index],
                                      webhook: {
                                        ...newData[index].webhook,
                                        pack: String(e.target.value),
                                      },
                                    };
                                    setConfig(newData);
                                  }}
                                  className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex mb-4 gap-4">
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                logs info
                              </p>
                              <div className="w-full">
                                <input
                                  type="text"
                                  value={item.webhook.logs}
                                  onChange={(e) => {
                                    const newData = [...config];
                                    newData[index] = {
                                      ...newData[index],
                                      webhook: {
                                        ...newData[index].webhook,
                                        logs: String(e.target.value),
                                      },
                                    };
                                    setConfig(newData);
                                  }}
                                  className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex mb-4 gap-4">
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                world info
                              </p>
                              <div className="w-full">
                                <input
                                  type="text"
                                  value={item.webhook.world}
                                  onChange={(e) => {
                                    const newData = [...config];
                                    newData[index] = {
                                      ...newData[index],
                                      webhook: {
                                        ...newData[index].webhook,
                                        world: String(e.target.value),
                                      },
                                    };
                                    setConfig(newData);
                                  }}
                                  className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Method settings */}
                        <div className="mb-10 p-5 bg-mainBg text-white overflow-x-hidden rounded-lg">
                          <p className="text-center text-lg font-bold text-gray-300 mb-4 uppercase">
                            Method settings
                          </p>
                          <div className="flex mb-4 gap-4">
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                buy clothes
                              </p>
                              <div className="inline-flex items-center">
                                <label className="flex items-center cursor-pointer relative">
                                  <input
                                    type="checkbox"
                                    checked={item.buy_clothes}
                                    onChange={(e) => {
                                      const newData = [...config];
                                      newData[index] = {
                                        ...newData[index],
                                        buy_clothes: e.target.checked,
                                      };
                                      setConfig(newData);
                                    }}
                                    className="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-400 checked:bg-violet-600 checked:border-slate-800"
                                    id="check"
                                  />
                                  <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3.5 w-3.5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      stroke="currentColor"
                                      strokeWidth="1"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      ></path>
                                    </svg>
                                  </span>
                                </label>
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                edit note profile
                              </p>
                              <div className="inline-flex items-center">
                                <label className="flex items-center cursor-pointer relative">
                                  <input
                                    type="checkbox"
                                    checked={item.edit_note_profile}
                                    onChange={(e) => {
                                      const newData = [...config];
                                      newData[index] = {
                                        ...newData[index],
                                        edit_note_profile: e.target.checked,
                                      };
                                      setConfig(newData);
                                    }}
                                    className="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-400 checked:bg-violet-600 checked:border-slate-800"
                                    id="check"
                                  />
                                  <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3.5 w-3.5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      stroke="currentColor"
                                      strokeWidth="1"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      ></path>
                                    </svg>
                                  </span>
                                </label>
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                random chat
                              </p>
                              <div className="inline-flex items-center">
                                <label className="flex items-center cursor-pointer relative">
                                  <input
                                    type="checkbox"
                                    checked={item.random_chat}
                                    onChange={(e) => {
                                      const newData = [...config];
                                      newData[index] = {
                                        ...newData[index],
                                        random_chat: e.target.checked,
                                      };
                                      setConfig(newData);
                                    }}
                                    className="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-400 checked:bg-violet-600 checked:border-slate-800"
                                    id="check"
                                  />
                                  <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3.5 w-3.5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      stroke="currentColor"
                                      strokeWidth="1"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      ></path>
                                    </svg>
                                  </span>
                                </label>
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                random world
                              </p>
                              <div className="inline-flex items-center">
                                <label className="flex items-center cursor-pointer relative">
                                  <input
                                    type="checkbox"
                                    checked={item.random_world}
                                    onChange={(e) => {
                                      const newData = [...config];
                                      newData[index] = {
                                        ...newData[index],
                                        random_world: e.target.checked,
                                      };
                                      setConfig(newData);
                                    }}
                                    className="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-400 checked:bg-violet-600 checked:border-slate-800"
                                    id="check"
                                  />
                                  <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3.5 w-3.5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      stroke="currentColor"
                                      strokeWidth="1"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      ></path>
                                    </svg>
                                  </span>
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="flex mb-4 gap-4">
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                enable claim goals
                              </p>
                              <div className="inline-flex items-center">
                                <label className="flex items-center cursor-pointer relative">
                                  <input
                                    type="checkbox"
                                    checked={item.claim_goals.enable}
                                    onChange={(e) => {
                                      const newData = [...config];
                                      newData[index] = {
                                        ...newData[index],
                                        claim_goals: {
                                          ...newData[index].claim_goals,
                                          enable: e.target.checked,
                                        },
                                      };
                                      setConfig(newData);
                                    }}
                                    className="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-400 checked:bg-violet-600 checked:border-slate-800"
                                    id="check"
                                  />
                                  <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3.5 w-3.5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      stroke="currentColor"
                                      strokeWidth="1"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      ></path>
                                    </svg>
                                  </span>
                                </label>
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex mb-4 gap-4">
                                <div className="flex-1">
                                  <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                    world goals
                                  </p>
                                  <div className="w-full">
                                    <input
                                      type="text"
                                      value={item.claim_goals.world}
                                      onChange={(e) => {
                                        const newData = [...config];
                                        newData[index] = {
                                          ...newData[index],
                                          claim_goals: {
                                            ...newData[index].claim_goals,
                                            world: e.target.value,
                                          },
                                        };
                                        setConfig(newData);
                                      }}
                                      className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex mb-4 gap-4">
                                <div className="flex-1">
                                  <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                    door goals
                                  </p>
                                  <div className="w-full">
                                    <input
                                      type="text"
                                      value={item.claim_goals.doorId}
                                      onChange={(e) => {
                                        const newData = [...config];
                                        newData[index] = {
                                          ...newData[index],
                                          claim_goals: {
                                            ...newData[index].claim_goals,
                                            doorId: e.target.value,
                                          },
                                        };
                                        setConfig(newData);
                                      }}
                                      className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex mb-4 gap-4">
                            <div className="flex-1">
                              <div className="flex mb-4 gap-4">
                                <div className="flex-1">
                                  <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                    world magplant
                                  </p>
                                  <div className="w-full">
                                    <input
                                      type="text"
                                      value={item.magplant.world}
                                      onChange={(e) => {
                                        const newData = [...config];
                                        newData[index] = {
                                          ...newData[index],
                                          magplant: {
                                            ...newData[index].magplant,
                                            world: e.target.value,
                                          },
                                        };
                                        setConfig(newData);
                                      }}
                                      className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex mb-4 gap-4">
                                <div className="flex-1">
                                  <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                    door magplant
                                  </p>
                                  <div className="w-full">
                                    <input
                                      type="text"
                                      value={item.magplant.doorId}
                                      onChange={(e) => {
                                        const newData = [...config];
                                        newData[index] = {
                                          ...newData[index],
                                          magplant: {
                                            ...newData[index].magplant,
                                            doorId: e.target.value,
                                          },
                                        };
                                        setConfig(newData);
                                      }}
                                      className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Essential settings */}
                        <div className="mb-4 p-5 bg-mainBg text-white overflow-x-hidden rounded-lg">
                          <p className="text-center text-lg font-bold text-gray-300 mb-4 uppercase">
                            essential settings
                          </p>
                          <div className="flex mb-4 gap-4">
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                whitelist item
                              </p>
                              <div className="w-full">
                                <input
                                  type="text"
                                  value={item.whitelist.join(",") || ""}
                                  onChange={(e) => {
                                    const newData = [...config];
                                    newData[index] = {
                                      ...newData[index],
                                      whitelist: e.target.value
                                        .split(",")
                                        .map((item) => Number(item.trim()))
                                    };
                                    setConfig(newData);
                                  }}
                                  className="w-full bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex mb-4 gap-4">
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                chat list
                              </p>
                              <div className="w-full">
                                <textarea
                                  value={item.chat_list.join("\r\n") || ""}
                                  onChange={(e) => {
                                    const newData = [...config];
                                    newData[index] = {
                                      ...newData[index],
                                      chat_list: e.target.value
                                        .split(",")
                                        .map((item) => Number(item.trim()))
                                    };
                                    setConfig(newData);
                                  }}
                                  className="w-full h-[150px] bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex mb-4 gap-4">
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-200 mb-2 uppercase">
                                chat list
                              </p>
                              <div className="w-full">
                                <textarea
                                  value={item.emote_list.join("\r\n") || ""}
                                  onChange={(e) =>
                                    setConfig({
                                      ...config,
                                      emote_list: e.target.value
                                        .split("\r\n")
                                        .map((item) => item.trim()), // Split by commas and trim whitespace
                                    })
                                  }
                                  className="w-full h-[250px] bg-[#111827] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='flex flex-col'>
                          <button 
                            onClick={() => updateConfig(index)} 
                            type="button" 
                            className="text-white bg-violet-600 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                            >
                            Save
                          </button>
                        </div>
                      </form>
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Config;
