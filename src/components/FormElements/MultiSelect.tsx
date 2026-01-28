"use client";
import React, { useEffect, useRef, useState } from "react";

interface Option {
  value: string;
  text: string;
}

interface MultiSelectProps {
  id: string;
  label?: string;
  placeholder?: string;
  options: Option[];
  defaultValues?: string[]; // IDs as strings
  onChange: (selectedValues: string[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  id,
  label = "Multiselect Dropdown",
  placeholder = "Select an option",
  options,
  defaultValues = [],
  onChange,
}) => {
  const [selected, setSelected] = useState<string[]>(defaultValues);
  const [show, setShow] = useState(false);
  const dropdownRef = useRef<any>(null);
  const trigger = useRef<any>(null);

  useEffect(() => {
    setSelected(defaultValues);
  }, [defaultValues]);

  const open = () => {
    setShow(true);
  };

  const isOpen = () => {
    return show === true;
  };

  const select = (value: string) => {
    let newSelected = [...selected];

    if (newSelected.includes(value)) {
      newSelected = newSelected.filter((item) => item !== value);
    } else {
      newSelected.push(value);
    }

    setSelected(newSelected);
    onChange(newSelected);
  };

  const remove = (value: string) => {
    const newSelected = selected.filter((item) => item !== value);
    setSelected(newSelected);
    onChange(newSelected);
  };

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (
        !show ||
        dropdownRef.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setShow(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  return (
    <div className="relative z-50">
      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-primary">
        {label}
      </label>
      <div>
        <div className="flex flex-col items-center">
          <div className="relative z-20 inline-block w-full">
            <div className="relative flex flex-col items-center">
              <div ref={trigger} onClick={open} className="w-full">
                <div className="mb-2 flex rounded-[7px] border-[1.5px] border-stroke py-[9px] pl-3 pr-3 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2">
                  <div className="flex flex-auto flex-wrap gap-3">
                    {selected.map((value) => {
                      const option = options.find(o => o.value === value);
                      return (
                        <div
                          key={value}
                          className="flex items-center justify-center rounded-[5px] border-[.5px] border-stroke bg-gray-2 px-2.5 py-[3px] text-body-sm font-medium dark:border-dark-3 dark:bg-dark"
                        >
                          <div className="max-w-full flex-initial">
                            {option ? option.text : value}
                          </div>
                          <div className="flex flex-auto flex-row-reverse">
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                remove(value);
                              }}
                              className="cursor-pointer pl-1 hover:text-red"
                            >
                              <svg
                                className="fill-current"
                                role="button"
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M9.35355 3.35355C9.54882 3.15829 9.54882 2.84171 9.35355 2.64645C9.15829 2.45118 8.84171 2.45118 8.64645 2.64645L6 5.29289L3.35355 2.64645C3.15829 2.45118 2.84171 2.45118 2.64645 2.64645C2.45118 2.84171 2.45118 3.15829 2.64645 3.35355L5.29289 6L2.64645 8.64645C2.45118 8.84171 2.45118 9.15829 2.64645 9.35355C2.84171 9.54882 3.15829 9.54882 3.35355 9.35355L6 6.70711L8.64645 9.35355C8.84171 9.54882 9.15829 9.54882 9.35355 9.35355C9.54882 9.15829 9.54882 8.84171 9.35355 8.64645L6.70711 6L9.35355 3.35355Z"
                                  fill=""
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {selected.length === 0 && (
                      <div className="flex-1">
                        <input
                          placeholder={placeholder}
                          className="h-full w-full appearance-none bg-transparent p-1 px-2 text-dark-5 outline-none dark:text-dark-6"
                          readOnly
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center py-1 pl-1 pr-1">
                    <button
                      type="button"
                      onClick={open}
                      className="cursor-pointer text-dark-4 outline-none focus:outline-none dark:text-dark-6"
                    >
                      <svg
                        className="fill-current"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M3.69149 7.09327C3.91613 6.83119 4.31069 6.80084 4.57277 7.02548L9.99936 11.6768L15.4259 7.02548C15.688 6.80084 16.0826 6.83119 16.3072 7.09327C16.5319 7.35535 16.5015 7.74991 16.2394 7.97455L10.4061 12.9745C10.172 13.1752 9.82667 13.1752 9.59261 12.9745L3.75928 7.97455C3.4972 7.74991 3.46685 7.35535 3.69149 7.09327Z"
                          fill=""
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-full px-4">
                <div
                  className={`max-h-select absolute left-0 top-full z-40 w-full overflow-y-auto rounded bg-white shadow-1 dark:bg-dark-2 dark:shadow-card ${isOpen() ? "" : "hidden"
                    }`}
                  ref={dropdownRef}
                  onFocus={() => setShow(true)}
                  onBlur={() => setShow(false)}
                >
                  <div className="flex w-full flex-col">
                    {options.map((option) => (
                      <div key={option.value}>
                        <div
                          className="w-full cursor-pointer rounded-t border-b border-stroke hover:bg-primary/5 dark:border-dark-3"
                          onClick={() => select(option.value)}
                        >
                          <div
                            className={`relative flex w-full items-center border-l-2 border-transparent p-2 pl-2 ${selected.includes(option.value) ? "border-primary" : ""
                              }`}
                          >
                            <div className="flex w-full items-center">
                              <div className="mx-2 leading-6">
                                {option.text}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiSelect;
