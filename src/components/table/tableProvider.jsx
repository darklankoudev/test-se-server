import endpointURL from '../../endpoint/endpoint';

const TableProvider = () => {
    return (
        <>
            <div className="overflow-x-auto overflow-y-auto rounded-bl-lg rounded-br-lg rounded-tl-lg rounded-tr-lg">
                <table data-tw-merge className="w-full text-left ">
                    <thead data-tw-merge className="text-white overflow-hidden bg-gradient-to-b from-theme-2/90 to-theme-1/[0.85] p-5">
                        <tr data-tw-merge className="[&amp;:hover_td]:bg-slate-100 [&amp;:hover_td]:dark:bg-darkmode-300 rounded [&amp;:hover_td]:dark:bg-opacity-50">
                            <th data-tw-merge className="font-medium px-5 py-4 border-b-2 dark:border-darkmode-300 border-l border-r border-t whitespace-nowrap">
                                Operate
                            </th>
                            <th data-tw-merge className="font-medium px-5 py-4 border-b-2 dark:border-darkmode-300 border-l border-r border-t whitespace-nowrap">
                                Moniker
                            </th>
                            <th data-tw-merge className="font-medium px-5 py-4 border-b-2 dark:border-darkmode-300 border-l border-r border-t whitespace-nowrap">
                                Endpoint URL
                            </th>
                            <th data-tw-merge className="font-medium px-5 py-4 border-b-2 dark:border-darkmode-300 border-l border-r border-t whitespace-nowrap">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {endpointURL.map((endpoint, index) => (
                            <tr key={index} className="[&amp;:hover_td]:bg-slate-100 [&amp;:hover_td]:dark:bg-darkmode-300 [&amp;:hover_td]:dark:bg-opacity-50">
                                <td className="px-5 py-4 border-b dark:border-darkmode-300 border-l border-r border-t">{endpoint.id}</td>
                                <td className="px-5 py-4 border-b dark:border-darkmode-300 border-l border-r border-t">{endpoint.alias}</td>
                                <td className="px-5 py-4 border-b dark:border-darkmode-300 border-l border-r border-t">
                                    <a href={endpoint.url} target="_blank" rel="noreferrer" alt="Endpoint" style={{color: "#6495ED"}}>{endpoint.url}</a>
                                </td>
                                <td className="px-5 py-4 border-b dark:border-darkmode-300 border-l border-r border-t">{endpoint.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default TableProvider;
