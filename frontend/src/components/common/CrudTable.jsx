import { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import { MdModeEditOutline } from "react-icons/md";
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { renderCell } from '../../utils/tableFormUtils';
import { useIsMobile } from '../../hooks/useWindowSize';
import './styles/CrudTable.css';

const CrudTable = ({
  title,
  headers,
  data,
  onEdit,
  onDelete,
  isLoading,
  error,
  mobileBreakpoint = 420
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const isMobile = useIsMobile({ mobileSize: mobileBreakpoint });

  const handleDelete = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    onDelete(itemToDelete);
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const renderCards = () => {
    return data.map((item, index) => (
      <article className="crud-card" key={item.id || index}>
        {headers.map((header, headerIndex) => (
          <section className="crud-card-item" key={headerIndex}>
            <h4 className="crud-card-label">{header.label}:</h4>
            <p className={`crud-card-value ${isMobile ? 'mobile' : ''} ${header.className || ''}`}>
              {renderCell(item, header)}</p>
          </section>
        ))}
        <footer className={`crud-card-actions ${isMobile ? 'mobile' : ''}`}>
          <button
            className={`crud-table-edit-button ${isMobile ? 'mobile' : ''}`}
            onClick={() => onEdit(item)}
          >
            <MdModeEditOutline />
          </button>
          <button
            className={`crud-table-delete-button ${isMobile ? 'mobile' : ''}`}
            onClick={() => handleDelete(item)}
          >
            <FaTrash />
          </button>
        </footer>
      </article>
    ));
  };

  return (
    <section className="crud-table-container">
      <header className={`crud-table-header ${isMobile ? 'mobile' : ''}`}>
        <h2>{title}</h2>
      </header>

      {isLoading && <p className="crud-table-loading">Cargando...</p>}

      {error && <p className="crud-table-error">Error: {error}</p>}

      {!isLoading && !error && (
        <>
          <div className={`crud-table-responsive ${isMobile ? 'mobile' : ''}`}>
            <table className="crud-table">
              <thead>
                <tr>
                  {headers.map((header, index) => (
                    <th key={index}>{header.label}</th>
                  ))}
                  <th className="crud-table-actions">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data && data.length > 0 ? (
                  data.map((item, rowIndex) => (
                    <tr key={item.id || rowIndex}>
                      {headers.map((header, colIndex) => (
                        <td key={colIndex}>{renderCell(item, header)}</td>
                      ))}
                      <td className="crud-table-actions">
                        <button
                          className={`crud-table-edit-button ${isMobile ? 'mobile' : ''}`}
                          onClick={() => onEdit(item)}
                        >
                          <MdModeEditOutline />
                        </button>
                        <button
                          className={`crud-table-delete-button ${isMobile ? 'mobile' : ''}`}
                          onClick={() => handleDelete(item)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={headers.length + 1} className="crud-table-empty">
                      No hay datos disponibles
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {data && data.length > 0 && (
            <section className={`crud-cards-view ${isMobile ? 'mobile' : ''}`}>
              {renderCards()}
            </section>
          )}
        </>
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Confirmar eliminación"
        message="¿Estás seguro de que deseas eliminar este registro?"
      />
    </section>
  );
};

export default CrudTable;