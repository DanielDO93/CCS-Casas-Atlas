import React, { Component } from "react";
import { Col, Row, FormGroup, Label, Input, Form } from "reactstrap";
import API_CCS from "../components/API_CCS";
import AuthService from "../components/AuthService";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Loader from "react-loader-spinner";
import { getStyle } from "@coreui/coreui/dist/js/coreui-utilities";
import { withRouter } from "react-router-dom";
import Select from "react-select";
import { ReactTabulator } from "react-tabulator"; // for React 15.x, use import { React15Tabulator }

const brandPrimary = getStyle("--primary");
const brandColor = "#fc4669";

const tipo = [
  { value: "Garantia Vencida", label: "Garantia Vencida" },
  { value: "Otro", label: "Otro" },
  { value: "Queja", label: "Queja" },
  { value: "Reporte de Garantia", label: "Reporte de Garantia" },
  {
    value: "Solicitud de Entrega de Vivienda",
    label: "Solicitud de Entrega de Vivienda",
  },
  { value: "Sugerencia", label: "Sugerencia" },
  { value: "Informacion", label: "Informacion" },
];

const MySwal = withReactContent(Swal);

const columnsRACS = [
  {
    title: "Tipo",
    field: "tipo",
    align: "center",
    width: 160,
  },
  {
    title: "Categoria",
    field: "categoria",
    align: "center",
    width: 180,
  },
  {
    title: "Especificacion",
    field: "especificacion",
    align: "center",
    width: 180,
  },
  {
    title: "Detalle",
    field: "detalle",
    align: "left",
    width: 610,
  },
];

const options = {
  movableRows: false,
  pagination: "local",
  paginationSize: 10,
};

const customStyles = {
  control: (base, state) => ({
    ...base,
    border: "1px solid #e4e7ea",
    borderRadius: "0.25rem",
    fontSize: "0.875rem",
    boxShadow: state.isFocused ? "0 0 0 0.2rem rgba(192, 3, 39, 0.25)" : 0,
    borderColor: state.isFocused ? brandColor : base.borderColor,
    "&:hover": {
      borderColor: state.isFocused ? brandColor : base.borderColor,
    },
    "&:active": {
      borderColor: state.isFocused ? brandColor : base.borderColor,
    },
  }),
};

const theme = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: "rgba(192,3,39,.2)",
    primary50: "rgba(192,3,39,.2)",
    primary75: "rgba(192,3,39,.2)",
    primary: "rgba(192,3,39,.8)",
  },
});

class EditarRAC extends Component {
  loading = () => (
    <div className="animated fadeIn pt-1 text-center">Cargando...</div>
  );
  ref = null;
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleGuardarRac = this.handleGuardarRac.bind(this);
    this.sendLlamadaSeguimiento = this.sendLlamadaSeguimiento.bind(this);
    this.addReport = this.addReport.bind(this);
    this.API_CCS = new API_CCS();
    this.Auth = new AuthService();
    this.formRef = React.createRef();
    this.state = {
      reportesAgregados: [],
      isSaving: false,
      tipo: "",
      categoria: "",
      categorias: [],
      especificacion: "",
      especificaciones: [],
      cp: "",
      id_user: this.Auth.getProfile().id_ccs,
      nombres: this.props.dataClient[0].nombres,
      paterno: this.props.dataClient[0].paterno,
      materno: this.props.dataClient[0].materno,
      sexo: this.props.dataClient[0].sexo,
      fecha_nacimiento: this.props.dataClient[0].fecha_nacimiento,
      estado_civil: this.props.dataClient[0].estado_civil,
      plaza: this.props.dataClient[0].plaza,
      desarrollo: this.props.dataClient[0].desarrollo,
      cerrada: this.props.dataClient[0].cerrada,
      prototipo: this.props.dataClient[0].prototipo,
      sector: this.props.dataClient[0].sector,
      supermanzana: this.props.dataClient[0].supermanzana,
      manzana: this.props.dataClient[0].manzana,
      lote: this.props.dataClient[0].lote,
      interior: this.props.dataClient[0].interior,
      no_cliente: this.props.dataClient[0].no_cliente,
      email: this.props.dataClient[0].email,
      tel1: this.props.dataClient[0].tel1,
      ext1: this.props.dataClient[0].ext1,
      tel2: this.props.dataClient[0].tel2,
      ext2: this.props.dataClient[0].ext2,
      entrega_vivienda: this.props.dataClient[0].entrega_vivienda,
      entrega_escrituras: this.props.dataClient[0].entrega_escrituras,
      descripcion: this.props.data[0].descripcion,
      racs: this.props.data[0].racs,
      clave_reporte: this.props.data[0].clave_reporte,
      reportesRACS: [],
      estatusRAC: this.props.data[0].status,
    };
  }

  componentDidMount() {
    if (
      this.props.function === "update" ||
      this.props.function === "desarrollos"
    ) {
      this.setState({
        reportesRACS:
          this.props.data[0].racs === null ||
          this.props.data[0].racs === undefined
            ? []
            : JSON.parse(this.props.data[0].racs),
      });
    }
  }
  handleChange(e) {
    this.setState({
      [e.target.id]: e.target.value,
    });
  }

  handleChangeTipo = (e) => {
    this.setState({
      categorias: [],
      categoria: "",
      especificacion: "",
      especificaciones: [],
    });

    try {
      this.setState({ tipo: e.label }, async () => {
        this.setState({
          categorias: await this.API_CCS.getTip2(this.state.tipo),
        });
      });
    } catch (err) {
      this.setState({ tipo: "" }, () => {
        this.setState({
          categorias: [],
          categoria: "",
          especificacion: "",
          especificaciones: [],
        });
      });
    }
  };

  handleChangeCategoria = (e) => {
    try {
      this.setState({ categoria: e.label }, async () => {
        this.setState({
          especificaciones: await this.API_CCS.getTip3(
            this.state.tipo,
            this.state.categoria
          ),
        });
      });
    } catch (err) {
      this.setState(
        { categoria: "", especificacion: "", especificaciones: [] },
        () => {}
      );
    }
  };

  handleChangeEspecificaciones = (e) => {
    try {
      this.setState({ especificacion: e.label }, async () => {});
    } catch (err) {
      this.setState({ especificacion: "" }, () => {});
    }
  };

  campos = async (ticket) => {
    const json = await this.API_CCS.getTicketCorreo(ticket);

    var obj = json[0];
    var text = "";

    for (var key in obj) {
      //console.log(' name=' + key + ' value=' + obj[key]);
      // do some more stuff with obj[key]
      console.clear();

      text =
        text +
        ` <div style='background-color:transparent;'>
                        <div style='Margin: 0 auto;min-width: 320px;max-width: 480px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #FFFFFF;' class='block-grid mixed-two-up '>
                            <div style='border-collapse: collapse;display: table;width: 100%;background-color:#FFFFFF;'>
                                <!--[if (mso)|(IE)]><table width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td style='background-color:transparent;' align='center'><table cellpadding='0' cellspacing='0' border='0' style='width: 480px;'><tr class='layout-full-width' style='background-color:#FFFFFF;'><![endif]-->
                                <!--[if (mso)|(IE)]><td align='center' width='320' style=' width:320px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;' valign='top'><![endif]-->
                                <div class='col num8' style='display: table-cell;vertical-align: top;min-width: 320px;max-width: 320px;'>
                                    <div style='background-color: transparent; width: 100% !important;'>
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div style='border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;'>
                                            <!--<![endif]-->
                                            <div class=''>
                                                <!--[if mso]><table width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td style='padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px;'><![endif]-->
                                                <div style='color:#000000;font-family:' Lato ', Tahoma, Verdana, Segoe, sans-serif;line-height:120%; padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px;'>
                                                    <div style='font-size:12px;line-height:14px;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;color:#000000;text-align:left;'>
                                                        <p style='margin: 0;font-size: 14px;line-height: 17px'><span style='color: rgb(0, 0, 0); font-size: 14px; line-height: 16px;'><a style='text-decoration: none; color: #000000;' href='#' target='_blank' rel='noopener'>` +
        key +
        `</a></span></p>
                                                    </div>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                            </div>
                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div>
                                        <!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td><td align='center' width='160' style=' width:160px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;' valign='top'><![endif]-->
                                <div class='col num4' style='display: table-cell;vertical-align: top;max-width: 320px;min-width: 160px;'>
                                    <div style='background-color: transparent; width: 100% !important;'>
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div style='border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;'>
                                            <!--<![endif]-->
                                            <div class=''>
                                                <!--[if mso]><table width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td style='padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px;'><![endif]-->
                                                <div style='color:#000000;font-family:' Lato ', Tahoma, Verdana, Segoe, sans-serif;line-height:120%; padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px;'>
                                                    <div style='font-size:12px;line-height:14px;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;color:#000000;text-align:left;'>
                                                        <p style='margin: 0;font-size: 14px;line-height: 17px'>` +
        obj[key] +
        `</p>
                                                    </div>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                            </div>
                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div>
                                        <!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                            </div>
                        </div>
                    </div>`;
    }

    return text;
  };

  sendLlamadaSeguimiento(e) {
    e.preventDefault();

    if (this.props.function === "desarrollos") {
      this.API_CCS.updateRACDesarrollo(this.state)
        .then((res) => {
          if (res.sucess === true) {
            MySwal.fire({
              title: "Correcto",
              text: "Llamada Guardada Correctamente!",
              type: "success",
              confirmButtonColor: "#C00327",
              allowOutsideClick: false,
            });
            this.setState({ selectedLead: null });
            this.setState({ isSaving: false });
            this.props.history.replace("/Inicio");
          } else {
            MySwal.fire({
              title: "Error",
              text:
                "Ocurrio un error al guardar el registro, por favor intenta de nuevo",
              type: "error",
              confirmButtonColor: "#C00327",
              allowOutsideClick: true,
            });
            this.setState({ isSaving: false });
          }
        })
        .catch((err) => {
          console.log(err);
          this.setState({ isSaving: false });
        });
    } else {
      this.API_CCS.updateRAC(this.state)
        .then((res) => {
          if (res.sucess === true) {
            MySwal.fire({
              title: "Correcto",
              text: "Llamada Guardada Correctamente!",
              type: "success",
              confirmButtonColor: "#C00327",
              allowOutsideClick: false,
            });
            this.setState({ selectedLead: null });
            this.setState({ isSaving: false });
            this.props.history.replace("/Inicio");
          } else {
            MySwal.fire({
              title: "Error",
              text:
                "Ocurrio un error al guardar el registro, por favor intenta de nuevo",
              type: "error",
              confirmButtonColor: "#C00327",
              allowOutsideClick: true,
            });
            this.setState({ isSaving: false });
          }
        })
        .catch((err) => {
          console.log(err);
          this.setState({ isSaving: false });
        });
    }
  }

  addReport(e) {
    e.preventDefault();

    var reportes = this.state.reportesAgregados;

    var nuevo = {
      tipo: this.state.tipo,
      categoria: this.state.categoria,
      especificacion: this.state.especificacion,
      detalle: this.state.detalle,
    };

    reportes.push(nuevo);
    this.ref.table.addRow(nuevo);
    this.setState({ reportesAgregados: reportes });
    this.setState({ racs: JSON.stringify(this.state.reportesAgregados) });
    this.setState({
      tipo: "",
      categoria: "",
      especificacion: "",
      detalle: "",
    });
  }

  handleGuardarRac(e) {
    e.preventDefault();

    var ticket = {
      user_alta: this.state.id_user,
      contacto: this.state.contacto,
      id_cliente: this.state.no_cliente,
      nombres: this.state.nombres,
      paterno: this.state.paterno,
      materno: this.state.materno,
      plaza: this.state.plaza,
      desarrollo: this.state.desarrollo,
      prototipo: this.state.prototipo,
      cerrada: this.state.cerrada,
      manzana: this.state.manzana,
      lote: this.state.lote,
      interior: this.state.interior,
      racs: this.state.racs,
    };
    if (this.state.racs === undefined) {
      MySwal.fire({
        title: "Error",
        text: "Debes agregar al menos un reporte",
        type: "error",
        confirmButtonColor: "#C00327",
        allowOutsideClick: true,
      });
      this.setState({ isSaving: false });
    } else {
      this.API_CCS.insertRAC(ticket)
        .then(async (res) => {
          if (res.sucess === true) {
            MySwal.fire({
              title: "¡Correcto!",
              html:
                "¡Se levanto el ticket No. <b>" +
                res.clave_reporte +
                "</b> correctamente!",
              type: "success",
              confirmButtonText: "OK",
              confirmButtonColor: "#C00327",
              allowOutsideClick: false,
            });
            //var now = new Date();
            // var curDate = now.toLocaleString("es-MX", {
            //   timeZone: "America/Mexico_City"
            // });


            var CUU =
              "ralvarez@atlasdesarrollos.com,pgutierrez@atlasdesarrollos.com,lortega@atlasdesarrollos.com,rbustillos@atlasdesarrollos.com,hmulia@atlasdesarrollos.com,asahagun@atlasdesarrollos.com,gvargas@atlasdesarrollos.com,ihuerta@atlasdesarrollos.com,cvargas@atlasdesarrollos.com,postventaatlas@atlasdesarrollos.com";
            var MTY =
              "ralvarez@atlasdesarrollos.com,msalas@atlasdesarrollos.com,aguzman@atlasdesarrollos.com,gserna@atlasdesarrollos.com,lcharles@atlasdesarrollos.com,jhernandez@atlasdesarrollos.com,postventaatlas@atlasdesarrollos.com";
            var QRO =
              "laguila@atlasdesarrollos.com,areyes@atlasdesarrollos.com,jsalcedo@atlasdesarrollos.com,gramos@atlasdesarrollos.com,lmartinez1@atlasdesarrollos.com,acruz@atlasdesarrollos.com,amaldonado@atlasdesarrollos.com,ssoto@atlasdesarrollos.com,ralvarez@atlasdesarrollos.com,jchavez@atlasdesarrollos.com,jdelgado@atlasdesarrollos.com,vsenteno@atlasdesarrollos.com,bbarrera@atlasdesarrollos.com,postventaatlas@atlasdesarrollos.com";
            var TRC =
              "ralvarez@atlasdesarrollos.com,postventaatlas@atlasdesarrollos.com,agonzalez@atlasdesarrollos.com";
            var CDMX =
              "agalarza@atlasdesarrollos.com,ralvarez@atlasdesarrollos.com,postventaatlas@atlasdesarrollos.com,agonzalez@atlasdesarrollos.com";
            var AGS =
              "isaac.contreras@ccscontactcenter.com, iacontrerasg@icloud.com, carolina.perez@ccscontactcenter.com, luis.ballines@ccscontactcenter.com,postventaatlas@atlasdesarrollos.com,agonzalez@atlasdesarrollos.com";
            var SJO =
              "isaac.contreras@ccscontactcenter.com, iacontrerasg@gmail.com, carolina.perez@ccscontactcenter.com, luis.ballines@ccscontactcenter.com,postventaatlas@atlasdesarrollos.com,agonzalez@atlasdesarrollos.com";
            var listaDistribucion = "";

            if (this.state.plaza === "AGUASCALIENTES") {
              listaDistribucion = AGS;
            } else if (this.state.plaza === "CHIHUAHUA") {
              listaDistribucion = CUU;
            } else if (this.state.plaza === "CIUDAD DE MEXICO") {
              listaDistribucion = CDMX;
            } else if (this.state.plaza === "LOS CABOS") {
              listaDistribucion = SJO;
            } else if (this.state.plaza === "MONTERREY") {
              listaDistribucion = MTY;
            } else if (this.state.plaza === "QUERÉTARO") {
              listaDistribucion = QRO;
            } else if (this.state.plaza === "TORREÓN") {
              listaDistribucion = TRC;
            } else {
              listaDistribucion = "isaac.contreras@ccscontactcenter.com";
            }

            var bodynew =
              `<!DOCTYPE HTML PUBLIC '-//W3C//DTD XHTML 1.0 Transitional //EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>
                <html xmlns='http://www.w3.org/1999/xhtml' xmlns:v='urn:schemas-microsoft-com:vml' xmlns:o='urn:schemas-microsoft-com:office:office'>

                <head>
                    <!--[if gte mso 9]><xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml><![endif]-->
                    <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
                    <meta name='viewport' content='width=device-width'>
                    <!--[if !mso]><!-->
                    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
                    <!--<![endif]-->
                    <title></title>
                    <!--[if !mso]><!-- -->
                    <link href='https://fonts.googleapis.com/css?family=Lato' rel='stylesheet' type='text/css'>
                    <!--<![endif]-->
                    <style type='text/css' id='media-query'>
                        body {
                            margin: 0;
                            padding: 0;
                        }
                        
                        table,
                        tr,
                        td {
                            vertical-align: top;
                            border-collapse: collapse;
                        }
                        
                        .ie-browser table,
                        .mso-container table {
                            table-layout: fixed;
                        }
                        
                        * {
                            line-height: inherit;
                        }
                        
                        a[x-apple-data-detectors=true] {
                            color: inherit !important;
                            text-decoration: none !important;
                        }
                        
                        [owa] .img-container div,
                        [owa] .img-container button {
                            display: block !important;
                        }
                        
                        [owa] .fullwidth button {
                            width: 100% !important;
                        }
                        
                        [owa] .block-grid .col {
                            display: table-cell;
                            float: none !important;
                            vertical-align: top;
                        }
                        
                        .ie-browser .num12,
                        .ie-browser .block-grid,
                        [owa] .num12,
                        [owa] .block-grid {
                            width: 480px !important;
                        }
                        
                        .ExternalClass,
                        .ExternalClass p,
                        .ExternalClass span,
                        .ExternalClass font,
                        .ExternalClass td,
                        .ExternalClass div {
                            line-height: 100%;
                        }
                        
                        .ie-browser .mixed-two-up .num4,
                        [owa] .mixed-two-up .num4 {
                            width: 160px !important;
                        }
                        
                        .ie-browser .mixed-two-up .num8,
                        [owa] .mixed-two-up .num8 {
                            width: 320px !important;
                        }
                        
                        .ie-browser .block-grid.two-up .col,
                        [owa] .block-grid.two-up .col {
                            width: 240px !important;
                        }
                        
                        .ie-browser .block-grid.three-up .col,
                        [owa] .block-grid.three-up .col {
                            width: 160px !important;
                        }
                        
                        .ie-browser .block-grid.four-up .col,
                        [owa] .block-grid.four-up .col {
                            width: 120px !important;
                        }
                        
                        .ie-browser .block-grid.five-up .col,
                        [owa] .block-grid.five-up .col {
                            width: 96px !important;
                        }
                        
                        .ie-browser .block-grid.six-up .col,
                        [owa] .block-grid.six-up .col {
                            width: 80px !important;
                        }
                        
                        .ie-browser .block-grid.seven-up .col,
                        [owa] .block-grid.seven-up .col {
                            width: 68px !important;
                        }
                        
                        .ie-browser .block-grid.eight-up .col,
                        [owa] .block-grid.eight-up .col {
                            width: 60px !important;
                        }
                        
                        .ie-browser .block-grid.nine-up .col,
                        [owa] .block-grid.nine-up .col {
                            width: 53px !important;
                        }
                        
                        .ie-browser .block-grid.ten-up .col,
                        [owa] .block-grid.ten-up .col {
                            width: 48px !important;
                        }
                        
                        .ie-browser .block-grid.eleven-up .col,
                        [owa] .block-grid.eleven-up .col {
                            width: 43px !important;
                        }
                        
                        .ie-browser .block-grid.twelve-up .col,
                        [owa] .block-grid.twelve-up .col {
                            width: 40px !important;
                        }
                        
                        @media only screen and (min-width: 500px) {
                            .block-grid {
                                width: 480px !important;
                            }
                            .block-grid .col {
                                vertical-align: top;
                            }
                            .block-grid .col.num12 {
                                width: 480px !important;
                            }
                            .block-grid.mixed-two-up .col.num4 {
                                width: 160px !important;
                            }
                            .block-grid.mixed-two-up .col.num8 {
                                width: 320px !important;
                            }
                            .block-grid.two-up .col {
                                width: 240px !important;
                            }
                            .block-grid.three-up .col {
                                width: 160px !important;
                            }
                            .block-grid.four-up .col {
                                width: 120px !important;
                            }
                            .block-grid.five-up .col {
                                width: 96px !important;
                            }
                            .block-grid.six-up .col {
                                width: 80px !important;
                            }
                            .block-grid.seven-up .col {
                                width: 68px !important;
                            }
                            .block-grid.eight-up .col {
                                width: 60px !important;
                            }
                            .block-grid.nine-up .col {
                                width: 53px !important;
                            }
                            .block-grid.ten-up .col {
                                width: 48px !important;
                            }
                            .block-grid.eleven-up .col {
                                width: 43px !important;
                            }
                            .block-grid.twelve-up .col {
                                width: 40px !important;
                            }
                        }
                        
                        @media (max-width: 500px) {
                            .block-grid,
                            .col {
                                min-width: 320px !important;
                                max-width: 100% !important;
                                display: block !important;
                            }
                            .block-grid {
                                width: calc(100% - 40px) !important;
                            }
                            .col {
                                width: 100% !important;
                            }
                            .col > div {
                                margin: 0 auto;
                            }
                            img.fullwidth,
                            img.fullwidthOnMobile {
                                max-width: 100% !important;
                            }
                            .no-stack .col {
                                min-width: 0 !important;
                                display: table-cell !important;
                            }
                            .no-stack.two-up .col {
                                width: 50% !important;
                            }
                            .no-stack.mixed-two-up .col.num4 {
                                width: 33% !important;
                            }
                            .no-stack.mixed-two-up .col.num8 {
                                width: 66% !important;
                            }
                            .no-stack.three-up .col.num4 {
                                width: 33% !important;
                            }
                            .no-stack.four-up .col.num3 {
                                width: 25% !important;
                            }
                            .mobile_hide {
                                min-height: 0px;
                                max-height: 0px;
                                max-width: 0px;
                                display: none;
                                overflow: hidden;
                                font-size: 0px;
                            }
                        }
                    </style>
                </head>

                <body class='clean-body' style='margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #FFFFFF'>
                    <style type='text/css' id='media-query-bodytag'>
                        @media (max-width: 520px) {
                            .block-grid {
                                min-width: 320px!important;
                                max-width: 100%!important;
                                width: 100%!important;
                                display: block!important;
                            }
                            .col {
                                min-width: 320px!important;
                                max-width: 100%!important;
                                width: 100%!important;
                                display: block!important;
                            }
                            .col > div {
                                margin: 0 auto;
                            }
                            img.fullwidth {
                                max-width: 100%!important;
                            }
                            img.fullwidthOnMobile {
                                max-width: 100%!important;
                            }
                            .no-stack .col {
                                min-width: 0!important;
                                display: table-cell!important;
                            }
                            .no-stack.two-up .col {
                                width: 50%!important;
                            }
                            .no-stack.mixed-two-up .col.num4 {
                                width: 33%!important;
                            }
                            .no-stack.mixed-two-up .col.num8 {
                                width: 66%!important;
                            }
                            .no-stack.three-up .col.num4 {
                                width: 33%!important;
                            }
                            .no-stack.four-up .col.num3 {
                                width: 25%!important;
                            }
                            .mobile_hide {
                                min-height: 0px!important;
                                max-height: 0px!important;
                                max-width: 0px!important;
                                display: none!important;
                                overflow: hidden!important;
                                font-size: 0px!important;
                            }
                        }
                    </style>
                    <!--[if IE]><div class='ie-browser'><![endif]-->
                    <!--[if mso]><div class='mso-container'><![endif]-->
                    <table class='nl-container' style='border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #FFFFFF;width: 100%' cellpadding='0' cellspacing='0'>
                        <tbody>
                            <tr style='vertical-align: top'>
                                <td style='word-break: break-word;border-collapse: collapse !important;vertical-align: top'>
                                    <!--[if (mso)|(IE)]><table width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td align='center' style='background-color: #FFFFFF;'><![endif]-->
                                    <div style='background-color:transparent;'>
                                        <div style='Margin: 0 auto;min-width: 320px;max-width: 480px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;' class='block-grid '>
                                            <div style='border-collapse: collapse;display: table;width: 100%;background-color:transparent;'>
                                                <!--[if (mso)|(IE)]><table width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td style='background-color:transparent;' align='center'><table cellpadding='0' cellspacing='0' border='0' style='width: 480px;'><tr class='layout-full-width' style='background-color:transparent;'><![endif]-->
                                                <!--[if (mso)|(IE)]><td align='center' width='480' style=' width:480px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;' valign='top'><![endif]-->
                                                <div class='col num12' style='min-width: 320px;max-width: 480px;display: table-cell;vertical-align: top;'>
                                                    <div style='background-color: transparent; width: 100% !important;'>
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                        <div style='border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;'>
                                                            <!--<![endif]-->
                                                            <div align='center' class='img-container center  autowidth  ' style='padding-right: 0px;  padding-left: 0px;'>
                                                                <!--[if mso]><table width='100%' cellpadding='0' cellspacing='0' border='0'><tr style='line-height:0px;line-height:0px;'><td style='padding-right: 0px; padding-left: 0px;' align='center'><![endif]--><img class='center  autowidth ' align='center' border='0' src='https://d1oco4z2z1fhwp.cloudfront.net/templates/default/18/okok.gif' alt='Image' title='Image' style='outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: 0;height: auto;float: none;width: 100%;max-width: 250px' width='250'>
                                                                <!--[if mso]></td></tr></table><![endif]-->
                                                            </div>
                                                            <!--[if (!mso)&(!IE)]><!-->
                                                        </div>
                                                        <!--<![endif]-->
                                                    </div>
                                                </div>
                                                <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                            </div>
                                        </div>
                                    </div>
                                    <div style='background-color:transparent;'>
                                        <div style='Margin: 0 auto;min-width: 320px;max-width: 480px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;' class='block-grid '>
                                            <div style='border-collapse: collapse;display: table;width: 100%;background-color:transparent;'>
                                                <!--[if (mso)|(IE)]><table width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td style='background-color:transparent;' align='center'><table cellpadding='0' cellspacing='0' border='0' style='width: 480px;'><tr class='layout-full-width' style='background-color:transparent;'><![endif]-->
                                                <!--[if (mso)|(IE)]><td align='center' width='480' style=' width:480px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:10px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;' valign='top'><![endif]-->
                                                <div class='col num12' style='min-width: 320px;max-width: 480px;display: table-cell;vertical-align: top;'>
                                                    <div style='background-color: transparent; width: 100% !important;'>
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                        <div style='border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:10px; padding-right: 0px; padding-left: 0px;'>
                                                            <!--<![endif]-->
                                                            <div class=''>
                                                                <!--[if mso]><table width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td style='padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 5px;'><![endif]-->
                                                                <div style='color:#000000;font-family:' Lato ', Tahoma, Verdana, Segoe, sans-serif;line-height:120%; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 5px;'>
                                                                    <div style='font-size:12px;line-height:14px;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;color:#000000;text-align:left;'>
                                                                        <p style='margin: 0;font-size: 14px;line-height: 17px;text-align: center'><strong style='background-color: transparent;'><span style='font-size: 18px; line-height: 21px;'>¡Ticket ` +
              res.clave_reporte +
              ` Levantado!</span></strong></p>
                                                                    </div>
                                                                </div>
                                                                <!--[if mso]></td></tr></table><![endif]-->
                                                            </div>
                                                            <!--[if (!mso)&(!IE)]><!-->
                                                        </div>
                                                        <!--<![endif]-->
                                                    </div>
                                                </div>
                                                <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                            </div>
                                        </div>
                                    </div>
                                    <div style='background-color:transparent;'>
                                        <div style='Margin: 0 auto;min-width: 320px;max-width: 480px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #000000;' class='block-grid mixed-two-up '>
                                            <div style='border-collapse: collapse;display: table;width: 100%;background-color:#000000;'>
                                                <!--[if (mso)|(IE)]><table width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td style='background-color:transparent;' align='center'><table cellpadding='0' cellspacing='0' border='0' style='width: 480px;'><tr class='layout-full-width' style='background-color:#000000;'><![endif]-->
                                                <!--[if (mso)|(IE)]><td align='center' width='320' style=' width:320px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;' valign='top'><![endif]-->
                                                <div class='col num8' style='display: table-cell;vertical-align: top;min-width: 320px;max-width: 320px;'>
                                                    <div style='background-color: transparent; width: 100% !important;'>
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                        <div style='border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;'>
                                                            <!--<![endif]-->
                                                            <div class=''>
                                                                <!--[if mso]><table width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td style='padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px;'><![endif]-->
                                                                <div style='color:#FFFFFF;font-family:' Lato ', Tahoma, Verdana, Segoe, sans-serif;line-height:120%; padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px;'>
                                                                    <div style='font-size:12px;line-height:14px;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;color:#FFFFFF;text-align:left;'>
                                                                        <p style='margin: 0;font-size: 14px;line-height: 17px'>Detalles</p>
                                                                    </div>
                                                                </div>
                                                                <!--[if mso]></td></tr></table><![endif]-->
                                                            </div>
                                                            <!--[if (!mso)&(!IE)]><!-->
                                                        </div>
                                                        <!--<![endif]-->
                                                    </div>
                                                </div>
                                                <!--[if (mso)|(IE)]></td><td align='center' width='160' style=' width:160px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;' valign='top'><![endif]-->
                                                <div class='col num4' style='display: table-cell;vertical-align: top;max-width: 320px;min-width: 160px;'>
                                                    <div style='background-color: transparent; width: 100% !important;'>
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                        <div style='border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;'>
                                                            <!--<![endif]-->
                                                            <div class=''>
                                                                <!--[if mso]><table width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td style='padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px;'><![endif]-->
                                                                <div style='color:#FFFFFF;font-family:' Lato ', Tahoma, Verdana, Segoe, sans-serif;line-height:120%; padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px;'>
                                                                    <div style='font-size:12px;line-height:14px;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;color:#FFFFFF;text-align:left;'>
                                                                        <p style='margin: 0;font-size: 14px;line-height: 17px'>&#160;</p>
                                                                    </div>
                                                                </div>
                                                                <!--[if mso]></td></tr></table><![endif]-->
                                                            </div>
                                                            <!--[if (!mso)&(!IE)]><!-->
                                                        </div>
                                                        <!--<![endif]-->
                                                    </div>
                                                </div>
                                                <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                            </div>
                                        </div>
                                    </div>` +
              (await this.campos(res.clave_reporte)) +
              `<div style='background-color:transparent;'>
                                        <div style='Margin: 0 auto;min-width: 320px;max-width: 480px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;' class='block-grid '>
                                            <div style='border-collapse: collapse;display: table;width: 100%;background-color:transparent;'>
                                                <!--[if (mso)|(IE)]><table width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td style='background-color:transparent;' align='center'><table cellpadding='0' cellspacing='0' border='0' style='width: 480px;'><tr class='layout-full-width' style='background-color:transparent;'><![endif]-->
                                                <!--[if (mso)|(IE)]><td align='center' width='480' style=' width:480px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;' valign='top'><![endif]-->
                                                <div class='col num12' style='min-width: 320px;max-width: 480px;display: table-cell;vertical-align: top;'>
                                                    <div style='background-color: transparent; width: 100% !important;'>
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                        <div style='border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;'>
                                                            <!--<![endif]-->
                                                            <table border='0' cellpadding='0' cellspacing='0' width='100%' class='divider ' style='border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%'>
                                                                <tbody>
                                                                    <tr style='vertical-align: top'>
                                                                        <td class='divider_inner' style='word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 10px;padding-left: 10px;padding-top: 10px;padding-bottom: 10px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%'>
                                                                            <table class='divider_content' height='0px' align='center' border='0' cellpadding='0' cellspacing='0' width='100%' style='border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px dotted #CCCCCC;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%'>
                                                                                <tbody>
                                                                                    <tr style='vertical-align: top'>
                                                                                        <td style='word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%'> <span>&#160;</span> </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <!--[if (!mso)&(!IE)]><!-->
                                                        </div>
                                                        <!--<![endif]-->
                                                    </div>
                                                </div>
                                                <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                            </div>
                                        </div>
                                    </div>
                                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <!--[if (mso)|(IE)]></div><![endif]-->
                </body>

                </html>`;

            console.log(bodynew);
            var datitos = {
              to: listaDistribucion,
              subject: "Nuevo Reporte Levantado",
              body: bodynew,
            };

            this.API_CCS.sendMail(datitos)
              .then((res) => {
                console.log("Enviado OK");
              })

              .catch((err) => {
                console.log("Correo no Enviado");
              });

            //###########aqui va el correo
            this.setState({ selectedLead: null });
            this.setState({ isSaving: false });
            this.props.history.replace("/Inicio");
          } else {
            MySwal.fire({
              title: "Error",
              text:
                "Ocurrio un error al guardar el registro, por favor intenta de nuevo",
              type: "error",
              confirmButtonColor: "#C00327",
              allowOutsideClick: true,
            });
            this.setState({ isSaving: false });
          }
        })
        .catch((err) => {
          console.log(err);
          this.setState({ isSaving: false });
        });
    }
  }

  handleFormSubmit(e) {
    e.preventDefault();

    this.API_CCS.updateCliente(this.state)
      .then((res) => {
        if (res.sucess === true) {
          MySwal.fire({
            title: "Correcto",
            text: "Cliente Actualizado Correctamente!",
            type: "success",
            confirmButtonColor: "#C00327",
            allowOutsideClick: false,
          });
          this.setState({ selectedLead: null });
          this.setState({ isSaving: false });
        } else {
          MySwal.fire({
            title: "Error",
            text:
              "Ocurrio un error al guardar el registro, por favor intenta de nuevo",
            type: "error",
            confirmButtonColor: "#C00327",
            allowOutsideClick: true,
          });
          this.setState({ isSaving: false });
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isSaving: false });
      });
  }

  render() {
    if (this.state.isSaving) {
      return (
        <div
          style={{
            height: "340px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div>
            <Loader type="Oval" color={brandPrimary} height="70" width="70" />{" "}
          </div>
        </div>
      );
    } else {
      return (
        <div className="animated fadeIn">
          <Form
            className="form-horizontal"
            onSubmit={this.handleFormSubmit}
            innerRef={this.formRef}
            autoComplete="off"
          >
            <Row>
              <Col className="col-sm-4">
                <FormGroup>
                  <Label htmlFor="prospecto">Nombres</Label>
                  <Input
                    type="text"
                    placeholder="Nombres"
                    required
                    onChange={this.handleChange}
                    id="nombres"
                    value={this.state.nombres}
                  />
                </FormGroup>
              </Col>
              <Col className="col-sm-4">
                <FormGroup>
                  <Label htmlFor="prospecto">Paterno</Label>
                  <Input
                    type="text"
                    placeholder="Apellido Paterno"
                    required
                    onChange={this.handleChange}
                    id="paterno"
                    value={this.state.paterno}
                  />
                </FormGroup>
              </Col>
              <Col className="col-sm-4">
                <FormGroup>
                  <Label htmlFor="prospecto">Materno</Label>
                  <Input
                    type="text"
                    placeholder="Apellido Materno"
                    onChange={this.handleChange}
                    id="materno"
                    required
                    value={this.state.materno}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col className="col-sm-4">
                <FormGroup>
                  <Label htmlFor="prospecto">Sexo</Label>
                  <Input
                    type="select"
                    placeholder="Categoría"
                    required
                    onChange={this.handleChange}
                    id="sexo"
                    value={this.state.sexo}
                  >
                    <option value="">-Selecciona-</option>
                    <option>Masculino</option>
                    <option>Femenino</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col className="col-sm-4">
                <FormGroup>
                  <Label htmlFor="prospecto">Fecha de Nacimiento</Label>
                  <Input
                    type="date"
                    placeholder="Fecha Nacimiento"
                    onChange={this.handleChange}
                    id="fecha_nacimiento"
                    required
                    value={this.state.fecha_nacimiento}
                  />
                </FormGroup>
              </Col>
              <Col className="col-sm-4">
                <FormGroup>
                  <Label htmlFor="prospecto">Estado Civil</Label>
                  <Input
                    type="select"
                    placeholder="Categoría"
                    onChange={this.handleChange}
                    id="estado_civil"
                    required
                    value={this.state.estado_civil}
                  >
                    <option value="">-Selecciona-</option>
                    <option>Casado</option>
                    <option>Divorciado</option>
                    <option>Soltero</option>
                    <option>Union Libre</option>
                    <option>Viudo</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col className="col-sm-4">
                <FormGroup>
                  <Label htmlFor="prospecto">Plaza</Label>
                  <Input
                    type="select"
                    placeholder="Categoría"
                    required
                    onChange={this.handleChange}
                    id="plaza"
                    value={this.state.plaza}
                  >
                    <option value="">-Selecciona-</option>
                    <option value="AGUASCALIENTES">AGUASCALIENTES</option>
                    <option value="CHIHUAHUA">CHIHUAHUA</option>
                    <option value="CIUDAD DE MEXICO">CIUDAD DE MEXICO</option>
                    <option value="LOS CABOS">LOS CABOS</option>
                    <option value="MONTERREY">MONTERREY</option>
                    <option value="QUERÉTARO">QUERÉTARO</option>
                    <option value="TORREÓN">TORREÓN</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col className="col-sm-4">
                <FormGroup>
                  <Label htmlFor="prospecto">Desarrollo</Label>
                  <Input
                    type="select"
                    placeholder="Categoría"
                    required
                    onChange={this.handleChange}
                    id="desarrollo"
                    value={this.state.desarrollo}
                  >
                    <option value="">-Selecciona-</option>
                    <option value="ALTOPOP">ALTOPOP</option>
                    <option value="ANCONA CUU">ANCONA CUU</option>
                    <option value="BIANCO QRO">BIANCO QRO</option>
                    <option value="BOJAI QRO">BOJAI QRO</option>
                    <option value="EL MIRADOR QRO">EL MIRADOR QRO</option>
                    <option value="LAS MISIONES SJC">LAS MISIONES SJC</option>
                    <option value="LIMONCELLO QRO">LIMONCELLO QRO</option>
                    <option value="LIVORNO TRC">LIVORNO TRC</option>
                    <option value="LOCALES QRO">LOCALES QRO</option>
                    <option value="LORETTO TRC">LORETTO TRC</option>
                    <option value="LOS NARANJOS AGS">LOS NARANJOS AGS</option>
                    <option value="MONTICELLO CUU">MONTICELLO CUU</option>
                    <option value="MONTICELLO MTY">MONTICELLO MTY</option>
                    <option value="MUESTRA MIRADOR">MUESTRA MIRADOR</option>
                    <option value="MURANO MTY">MURANO MTY</option>
                    <option value="ORLEANS CUU">ORLEANS CUU</option>
                    <option value="PASEO SAVELLI">PASEO SAVELLI</option>
                    <option value="PROVENZA QRO">PROVENZA QRO</option>
                    <option value="PUERTA REAL TRC">PUERTA REAL TRC</option>
                    <option value="PUERTA SAVONA CUU">PUERTA SAVONA CUU</option>
                    <option value="PUERTA VERONA QRO">PUERTA VERONA QRO</option>
                    <option value="ROMANA PASEO SICILIA QTO">
                      ROMANA PASEO SICILIA QTO
                    </option>
                    <option value="SANTA LUCIA CUU">SANTA LUCIA CUU</option>
                    <option value="SANTA LUCIA QRO">SANTA LUCIA QRO</option>
                    <option value="SANTORINI QRO">SANTORINI QRO</option>
                    <option value="SONTERRA VILLA NAPOLES II QTO">
                      SONTERRA VILLA NAPOLES II QTO
                    </option>
                    <option value="SONTERRA VILLA NAPOLES III QTO">
                      SONTERRA VILLA NAPOLES III QTO
                    </option>
                    <option value="SONTERRA VILLA NAPOLES QTO">
                      SONTERRA VILLA NAPOLES QTO
                    </option>
                    <option value="VILLA BRESCIA QRO">VILLA BRESCIA QRO</option>
                    <option value="VILLA CAPRI AGS">VILLA CAPRI AGS</option>
                    <option value="VILLA CAPRI QTO">VILLA CAPRI QTO</option>
                    <option value="VILLA CAPRI TRC">VILLA CAPRI TRC</option>
                    <option value="VILLA CATANIA">VILLA CATANIA</option>
                    <option value="VILLA FERRARA">VILLA FERRARA</option>
                    <option value="VILLA LORETO CUU">VILLA LORETO CUU</option>
                    <option value="VILLA NAPOLES CUU">VILLA NAPOLES CUU</option>
                    <option value="VILLA NAPOLES IV QTO">
                      VILLA NAPOLES IV QTO
                    </option>
                    <option value="VILLA NAPOLES V QRO">
                      VILLA NAPOLES V QRO
                    </option>
                    <option value="VILLA ROMANA QRO">VILLA ROMANA QRO</option>
                    <option value="VILLA ROMANA TRC">VILLA ROMANA TRC</option>
                    <option value="VILLA SAN LORENZO I CUU">
                      VILLA SAN LORENZO I CUU
                    </option>
                    <option value="VILLA SAN LORENZO III,IV CUU">
                      VILLA SAN LORENZO III,IV CUU
                    </option>
                    <option value="VILLA SAN LORENZO QTO">
                      VILLA SAN LORENZO QTO{" "}
                    </option>
                    <option value="VILLA SAN LORENZO V CUU">
                      VILLA SAN LORENZO V CUU
                    </option>
                    <option value="VILLA TOLEDO QRO">VILLA TOLEDO QRO</option>
                    <option value="VILLA TOSCANA CUU">VILLA TOSCANA CUU</option>
                    <option value="VILLA TOSCANA QTO">VILLA TOSCANA QTO</option>
                    <option value="VILLA TOSCANA TRC">VILLA TOSCANA TRC</option>
                    <option value="VILLA VENETTO AGS">VILLA VENETTO AGS</option>
                    <option value="VILLA VENETTO QTO">VILLA VENETTO QTO</option>
                    <option value="VILLAS SANTORINI TRC">
                      VILLAS SANTORINI TRC
                    </option>
                    <option value="ZAKIA CELESTE QRO">ZAKIA CELESTE QRO</option>
                    <option value="ZIBATA QRO">ZIBATA QRO</option>
                    <option value="FERRARA MTY">FERRARA MTY</option>
                    <option value="AMARELLO QRO">AMARELLO QRO</option>
                    <option value="VARENNA QRO">VARENNA QRO</option>
                    <option value="BOREAL CUU">BOREAL CUU</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col className="col-sm-4">
                <FormGroup>
                  <Label htmlFor="prospecto">Cerrada</Label>
                  <Input
                    type="select"
                    placeholder="Categoría"
                    onChange={this.handleChange}
                    id="cerrada"
                    required
                    value={this.state.cerrada}
                  >
                    <option value="">-Selecciona-</option>
                    <option value="ALTOPOP">ALTOPOP</option>
                    <option value="ANCONA CUU">ANCONA CUU</option>
                    <option value="ARLES QRO">ARLES QRO</option>
                    <option value="AVINON">AVINON</option>
                    <option value="BIANCO CASA M">BIANCO CASA M</option>
                    <option value="BOJAI QRO">BOJAI QRO</option>
                    <option value="CABORA BASSA">CABORA BASSA</option>
                    <option value="CALVIN">CALVIN</option>
                    <option value="CANTAL">CANTAL</option>
                    <option value="CASA MUESTRA">CASA MUESTRA</option>
                    <option value="CASAS MUESTRA">CASAS MUESTRA</option>
                    <option value="CASSIS">CASSIS</option>
                    <option value="CEIBA">CEIBA</option>
                    <option value="CELESTE QRO">CELESTE QRO</option>
                    <option value="CERRADA ALEARDI">CERRADA ALEARDI</option>
                    <option value="CERRADA BRESCIA">CERRADA BRESCIA</option>
                    <option value="CERRADA CARLOTTI">CERRADA CARLOTTI</option>
                    <option value="CERRADA CATENA">CERRADA CATENA</option>
                    <option value="CERRADA CEIBA">CERRADA CEIBA</option>
                    <option value="CERRADA FERROVIA">CERRADA FERROVIA</option>
                    <option value="CERRADA FIORELO">CERRADA FIORELO</option>
                    <option value="CERRADA FIORELO QRO">
                      CERRADA FIORELO QRO
                    </option>
                    <option value="CERRADA FRANCESCO">CERRADA FRANCESCO</option>
                    <option value="CERRADA GARIBALDI">CERRADA GARIBALDI</option>
                    <option value="CERRADA NUOVO QRO">CERRADA NUOVO QRO</option>
                    <option value="CERRADA SICILIA">CERRADA SICILIA</option>
                    <option value="CERRADA YOLA">CERRADA YOLA</option>
                    <option value="CORCEGA">CORCEGA</option>
                    <option value="DONATO MTY">DONATO MTY</option>
                    <option value="FERRARA QTO">FERRARA QTO</option>
                    <option value="GARIBALDI">GARIBALDI</option>
                    <option value="ISLA PEREJIL">ISLA PEREJIL</option>
                    <option value="LIMONCELLO">LIMONCELLO</option>
                    <option value="LIMONCELLO QRO">LIMONCELLO QRO</option>
                    <option value="LIVORNO TRC">LIVORNO TRC</option>
                    <option value="LORETO">LORETO</option>
                    <option value="LORETTO TRC">LORETTO TRC</option>
                    <option value="MAGARIA">MAGARIA</option>
                    <option value="MASCARE�AS">MASCARE�AS</option>
                    <option value="MONTEMORO">MONTEMORO</option>
                    <option value="MONTICELLO">MONTICELLO</option>
                    <option value="MONTICELLO CUU">MONTICELLO CUU</option>
                    <option value="MONTICELLO I, II">MONTICELLO I, II</option>
                    <option value="MONTICELLO II CUU">MONTICELLO II CUU</option>
                    <option value="MONTICELLO III">MONTICELLO III</option>
                    <option value="MONTICELLO III CUU">
                      MONTICELLO III CUU
                    </option>
                    <option value="MONTICELLO IV MTY">MONTICELLO IV MTY</option>
                    <option value="MONTICELLO V MTY">MONTICELLO V MTY</option>
                    <option value="MONTICELLO VI MTY">MONTICELLO VI MTY</option>
                    <option value="MUESTRA">MUESTRA</option>
                    <option value="MURANO I">MURANO I</option>
                    <option value="NAPOLES">NAPOLES</option>
                    <option value="NAPOLES CUU">NAPOLES CUU</option>
                    <option value="NAPOLES II">NAPOLES II</option>
                    <option value="NAPOLES III">NAPOLES III</option>
                    <option value="NAPOLES III CUU">NAPOLES III CUU</option>
                    <option value="NAPOLES IV">NAPOLES IV</option>
                    <option value="NAPOLES V">NAPOLES V</option>
                    <option value="NIZA">NIZA</option>
                    <option value="NUOVO">NUOVO</option>
                    <option value="NUVOLE">NUVOLE</option>
                    <option value="OLMO">OLMO</option>
                    <option value="ORLEANS I CUU">ORLEANS I CUU</option>
                    <option value="ORLEANS II CUU">ORLEANS II CUU</option>
                    <option value="PASEO ANCONA QTO">PASEO ANCONA QTO</option>
                    <option value="PASEO ARCEVIA QTO">PASEO ARCEVIA QTO</option>
                    <option value="PASEO BERNINI">PASEO BERNINI</option>
                    <option value="PASEO BORBON">PASEO BORBON</option>
                    <option value="PASEO DA VINCI">PASEO DA VINCI</option>
                    <option value="PASEO FIORELO">PASEO FIORELO</option>
                    <option value="PASEO FLORENCIA">PASEO FLORENCIA</option>
                    <option value="PASEO GRIMALDI">PASEO GRIMALDI</option>
                    <option value="PASEO HABSBURGO">PASEO HABSBURGO</option>
                    <option value="PASEO LIVORNO">PASEO LIVORNO</option>
                    <option value="PASEO LOS ALAMOS">PASEO LOS ALAMOS</option>
                    <option value="PASEO LOS ENCINOS">PASEO LOS ENCINOS</option>
                    <option value="PASEO LOS NOGALES">PASEO LOS NOGALES</option>
                    <option value="PASEO LOS OLIVOS">PASEO LOS OLIVOS</option>
                    <option value="PASEO MIGUEL ANGEL">
                      PASEO MIGUEL ANGEL
                    </option>
                    <option value="PASEO ORLEANS">PASEO ORLEANS</option>
                    <option value="PASEO SABOYA">PASEO SABOYA</option>
                    <option value="PASEO SAN RAFAEL">PASEO SAN RAFAEL</option>
                    <option value="PASEO SAVAL QRO">PASEO SAVAL QRO</option>
                    <option value="PASEO SAVELLI">PASEO SAVELLI</option>
                    <option value="PASEO SIENA">PASEO SIENA</option>
                    <option value="PASEO WINDSOR">PASEO WINDSOR</option>
                    <option value="PRIVADA ALICANTE">PRIVADA ALICANTE</option>
                    <option value="PRIVADA CANTABRIA">PRIVADA CANTABRIA</option>
                    <option value="PRIVADA COLISEO">PRIVADA COLISEO</option>
                    <option value="PRIVADA DEL CORSO">PRIVADA DEL CORSO</option>
                    <option value="PRIVADA NAVONA">PRIVADA NAVONA</option>
                    <option value="PROVENZA CASSIS QRO">
                      PROVENZA CASSIS QRO
                    </option>
                    <option value="PROVENZA NIZA QRO">PROVENZA NIZA QRO</option>
                    <option value="PUERTA SANTUARIO CUU">
                      PUERTA SANTUARIO CUU
                    </option>
                    <option value="SABORA BASSA">SABORA BASSA</option>
                    <option value="SAN LORENZO III">SAN LORENZO III</option>
                    <option value="SAN LORENZO IV">SAN LORENZO IV</option>
                    <option value="SAN LORENZO V">SAN LORENZO V</option>
                    <option value="SANTA LUCIA">SANTA LUCIA</option>
                    <option value="SANTORINI QRO">SANTORINI QRO</option>
                    <option value="SANTUARIO">SANTUARIO</option>
                    <option value="SAVAL QRO">SAVAL QRO</option>
                    <option value="SAVONA">SAVONA</option>
                    <option value="SAVONA ETAPA C">SAVONA ETAPA C</option>
                    <option value="SAVONA ETAPA D">SAVONA ETAPA D</option>
                    <option value="SAVONA ETAPA E">SAVONA ETAPA E</option>
                    <option value="TENERES">TENERES</option>
                    <option value="TOLEDO">TOLEDO</option>
                    <option value="TRAMONTO">TRAMONTO</option>
                    <option value="VILLA CAPRI">VILLA CAPRI</option>
                    <option value="VILLA TOSCANA">VILLA TOSCANA</option>
                    <option value="YOLA">YOLA</option>
                    <option value="FERRARA I">FERRARA I</option>
                    <option value="AMARELLO QRO">AMARELLO QRO</option>
                    <option value="VARENNA QRO">VARENNA QRO</option>
                    <option value="Cerrada Victoria">Cerrada Victoria</option>
                    <option value="PROVENZA ARLES">PROVENZA ARLES</option>
                    <option value="PROVENZA AVIÑON">PROVENZA AVIÑON</option>
                    <option value="PROVENZA MARSELLA">PROVENZA MARSELLA</option>
                    <option value="BOREAL CUU">BOREAL CUU</option>
                    <option value="CERRADA VENECIA">CERRADA VENECIA</option>
                    
                  </Input>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col className="col-sm-6">
                <FormGroup>
                  <Label htmlFor="prospecto">Prototipo</Label>
                  <Input
                    type="select"
                    placeholder="Categoría"
                    onChange={this.handleChange}
                    id="prototipo"
                    required
                    value={this.state.prototipo}
                  >
                    <option value="">-Selecciona-</option>
                    <option value="1A">1A</option>
                    <option value="1B">1B</option>
                    <option value="2A">2A</option>
                    <option value="2B">2B</option>
                    <option value="3A">3A</option>
                    <option value="5A">5A</option>
                    <option value="5B">5B</option>
                    <option value="6A">6A</option>
                    <option value="6B">6B</option>
                    <option value="6B ESQ">6B ESQ</option>
                    <option value="7A">7A</option>
                    <option value="7B">7B</option>
                    <option value="ALISEO">ALISEO</option>
                    <option value="ALISEO A">ALISEO A</option>
                    <option value="ALISEO B">ALISEO B</option>
                    <option value="ALISEO IS">ALISEO IS</option>
                    <option value="AMALFI A">AMALFI A</option>
                    <option value="AMALFI B">AMALFI B</option>
                    <option value="BARTOLI A">BARTOLI A</option>
                    <option value="BELLINI A 122 M2">BELLINI A 122 M2</option>
                    <option value="BELLINI A C/PASILLO INT">
                      BELLINI A C/PASILLO INT
                    </option>
                    <option value="BELLINI B C/PASILLO INT">
                      BELLINI B C/PASILLO INT
                    </option>
                    <option value="BERNINI 82 A">BERNINI 82 A</option>
                    <option value="BERNINI A">BERNINI A</option>
                    <option value="BERNINI A UM">BERNINI A UM</option>
                    <option value="BERNINI AMPL">BERNINI AMPL</option>
                    <option value="BERNINI B">BERNINI B</option>
                    <option value="BLU A">BLU A</option>
                    <option value="BORGHESE A">BORGHESE A</option>
                    <option value="BORGHESE ESQ 2">BORGHESE ESQ 2</option>
                    <option value="BORGHESE ESQUINERA">
                      BORGHESE ESQUINERA
                    </option>
                    <option value="BORGHESE MED A">BORGHESE MED A</option>
                    <option value="BORGHESE MED C">BORGHESE MED C</option>
                    <option value="BORGHESE MED D">BORGHESE MED D</option>
                    <option value="BORGHESE MED. A">BORGHESE MED. A</option>
                    <option value="BORGHESE MED. B">BORGHESE MED. B</option>
                    <option value="BORGHESE MED. C">BORGHESE MED. C</option>
                    <option value="BORGHESE MED. D">BORGHESE MED. D</option>
                    <option value="BORGIA  MED. C 119 M2">
                      BORGIA MED. C 119 M2
                    </option>
                    <option value="BORGIA (BOA)">BORGIA (BOA)</option>
                    <option value="BORGIA A">BORGIA A</option>
                    <option value="BORGIA B">BORGIA B</option>
                    <option value="BORGIA C">BORGIA C</option>
                    <option value="BORGIA CP">BORGIA CP</option>
                    <option value="BORGIA D">BORGIA D</option>
                    <option value="BORGIA ESQ">BORGIA ESQ</option>
                    <option value="BORGIA ESQ.2 119 M2">
                      BORGIA ESQ.2 119 M2
                    </option>
                    <option value="BORGIA ESQ2 119 M2">
                      BORGIA ESQ2 119 M2
                    </option>
                    <option value="BORGIA MED A 119 M2">
                      BORGIA MED A 119 M2
                    </option>
                    <option value="BORGIA MED B 119 M2">
                      BORGIA MED B 119 M2
                    </option>
                    <option value="BORGIA MED C 119 M2">
                      BORGIA MED C 119 M2
                    </option>
                    <option value="BORGIA MED. A 119 M2">
                      BORGIA MED. A 119 M2{" "}
                    </option>
                    <option value="BORGIA MED. B 119 M2">
                      {" "}
                      BORGIA MED. B 119 M2
                    </option>
                    <option value="BORGIA SP">BORGIA SP</option>
                    <option value="BORGUESE">BORGUESE</option>
                    <option value="BOTICELLI">BOTICELLI</option>
                    <option value="BOTICELLI A">BOTICELLI A</option>
                    <option value="BOTICELLI B">BOTICELLI B</option>
                    <option value="BOTICELLI C">BOTICELLI C</option>
                    <option value="BOTICELLI D">BOTICELLI D</option>
                    <option value="CAPRI A MTY">CAPRI A MTY</option>
                    <option value="CAPRI B CUU">CAPRI B CUU</option>
                    <option value="CAPRI CUU">CAPRI CUU</option>
                    <option value="CAPRI MTY">CAPRI MTY</option>
                    <option value="CELESTE A">CELESTE A</option>
                    <option value="CELESTE B">CELESTE B</option>
                    <option value="CERRADA FIORELO QRO">
                      CERRADA FIORELO QRO
                    </option>
                    <option value="CHAMBORD">CHAMBORD</option>
                    <option value="CHAMBORD A">CHAMBORD A</option>
                    <option value="DAVINCI A">DAVINCI A</option>
                    <option value="DAVINCI B">DAVINCI B</option>
                    <option value="DAVINCI C">DAVINCI C</option>
                    <option value="DONATELLO A">DONATELLO A</option>
                    <option value="DONATELLO B">DONATELLO B</option>
                    <option value="DONATELLO C">DONATELLO C</option>
                    <option value="DONATELLO ESQ">DONATELLO ESQ</option>
                    <option value="DORATO A">DORATO A</option>
                    <option value="DORATO B">DORATO B</option>
                    <option value="FARINELLI A">FARINELLI A</option>
                    <option value="FARINELLI A 137 M2">
                      FARINELLI A 137 M2
                    </option>
                    <option value="FARINELLI B">FARINELLI B</option>
                    <option value="FARINELLI B 137 M2">
                      FARINELLI B 137 M2
                    </option>
                    <option value="FARINELLI C">FARINELLI C</option>
                    <option value="FARINELLI C 137 M2">
                      FARINELLI C 137 M2
                    </option>
                    <option value="FARINELLI ESQ 137 M2">
                      {" "}
                      FARINELLI ESQ 137 M2
                    </option>
                    <option value="FELINI A">FELINI A</option>
                    <option value="FELINI B">FELINI B</option>
                    <option value="FELLINI A">FELLINI A</option>
                    <option value="FELLINI ESQ">FELLINI ESQ</option>
                    <option value="FLORENTININO A">FLORENTININO A</option>
                    <option value="FLORENTINO">FLORENTINO</option>
                    <option value="FLORENTINO 70 A">FLORENTINO 70 A</option>
                    <option value="FLORENTINO 70 B">FLORENTINO 70 B</option>
                    <option value="FLORENTINO 70 C">FLORENTINO 70 C</option>
                    <option value="FLORENTINO 90 A">FLORENTINO 90 A</option>
                    <option value="FLORENTINO 90 B">FLORENTINO 90 B</option>
                    <option value="FLORENTINO 90 ESQ">FLORENTINO 90 ESQ</option>
                    <option value="FLORENTINO B">FLORENTINO B</option>
                    <option value="FONTANA">FONTANA</option>
                    <option value="FONTANA A">FONTANA A</option>
                    <option value="GARIBALDI">GARIBALDI</option>
                    <option value="GENOVA">GENOVA</option>
                    <option value="GENOVA A">GENOVA A</option>
                    <option value="GRIMALDI ESQ.">GRIMALDI ESQ.</option>
                    <option value="GRIMALDI MED. B">GRIMALDI MED. B</option>
                    <option value="LOTE A">LOTE A</option>
                    <option value="LOTE B">LOTE B</option>
                    <option value="LUCCA B CUU">LUCCA B CUU</option>
                    <option value="LUCCA CUU">LUCCA CUU</option>
                    <option value="LUCIANA">LUCIANA</option>
                    <option value="LYON">LYON</option>
                    <option value="LYON A">LYON A</option>
                    <option value="LYON B">LYON B</option>
                    <option value="LYON C">LYON C</option>
                    <option value="LYON MTY">LYON MTY</option>
                    <option value="LYON QRO">LYON QRO</option>
                    <option value="MAGENTA A">MAGENTA A</option>
                    <option value="MAGENTA B">MAGENTA B</option>
                    <option value="MARBELLA">MARBELLA</option>
                    <option value="MARBELLA 113 A">MARBELLA 113 A</option>
                    <option value="MARBELLA 113 B">MARBELLA 113 B</option>
                    <option value="MARBELLA 95 A">MARBELLA 95 A</option>
                    <option value="MARBELLA 95 B">MARBELLA 95 B</option>
                    <option value="MARBELLA A">MARBELLA A</option>
                    <option value="MARBELLA B">MARBELLA B</option>
                    <option value="MARRONE A">MARRONE A</option>
                    <option value="MARSELLA">MARSELLA</option>
                    <option value="MARSELLA A MTY">MARSELLA A MTY</option>
                    <option value="MARSELLA A ROOF TOP MTY">
                      MARSELLA A ROOF TOP MTY
                    </option>
                    <option value="MARSELLA B">MARSELLA B</option>
                    <option value="MARSELLA B ROOF TOP MTY">
                      MARSELLA B ROOF TOP MTY
                    </option>
                    <option value="MEDICCI D">MEDICCI D</option>
                    <option value="MEDICCI ESQUINERA 1 159 M2">
                      MEDICCI ESQUINERA 1 159 M2
                    </option>
                    <option value="MEDICCI ESQUINERA 2 159 M2">
                      MEDICCI ESQUINERA 2 159 M2
                    </option>
                    <option value="MEDICCI ESQUINERA 2 163 M2">
                      MEDICCI ESQUINERA 2 163 M2
                    </option>
                    <option value="MEDICI">MEDICI</option>
                    <option value="MEDICI A">MEDICI A</option>
                    <option value="MEDICI A 164 M2">MEDICI A 164 M2</option>
                    <option value="MEDICI B">MEDICI B</option>
                    <option value="MEDICI C">MEDICI C</option>
                    <option value="MEDICI CON BALCON ESQ 2 163M2">
                      MEDICI CON BALCON ESQ 2 163M2
                    </option>
                    <option value="MEDICI CON BALCON ESQ. 2 163M2">
                      MEDICI CON BALCON ESQ. 2 163M2
                    </option>
                    <option value="MEDICI D 159 M2">MEDICI D 159 M2</option>
                    <option value="MEDICI D 163 M2">MEDICI D 163 M2</option>
                    <option value="MEDICI D 164 M2 C/CTO DE SERV">
                      MEDICI D 164 M2 C/CTO DE SERV
                    </option>
                    <option value="MEDICI D CON BALCON 163 M2">
                      MEDICI D CON BALCON 163 M2
                    </option>
                    <option value="MEDICI ESQ">MEDICI ESQ</option>
                    <option value="MEDICI ESQ 164  S/CTO DE SERV">
                      MEDICI ESQ 164 S/CTO DE SERV
                    </option>
                    <option value="MEDICI ESQ 164 C/ BCON S/CTOS">
                      MEDICI ESQ 164 C/ BCON S/CTOS
                    </option>
                    <option value="MEDICI ESQ1 164M C/CTO DE SERV">
                      MEDICI ESQ1 164M C/CTO DE SERV
                    </option>
                    <option value="MEDICI ESQUINERA 1">
                      MEDICI ESQUINERA 1
                    </option>
                    <option value="MEDICI ESQUINERA 159 M2">
                      MEDICI ESQUINERA 159 M2
                    </option>
                    <option value="MEDICI ESQUINERA 164 M2">
                      MEDICI ESQUINERA 164 M2
                    </option>
                    <option value="MEDICI ESQUINERA 2 163 M2">
                      MEDICI ESQUINERA 2 163 M2
                    </option>
                    <option value="MICHELANGELO">MICHELANGELO</option>
                    <option value="MICHELANGELO A">MICHELANGELO A</option>
                    <option value="MICHELANGELO B">MICHELANGELO B</option>
                    <option value="MICHELANGELO C">MICHELANGELO C</option>
                    <option value="MICHELANGELO ESQ">MICHELANGELO ESQ</option>
                    <option value="MILANO">MILANO</option>
                    <option value="MILANO A">MILANO A</option>
                    <option value="MILANO B">MILANO B</option>
                    <option value="MILANO C">MILANO C</option>
                    <option value="MILANO IS">MILANO IS</option>
                    <option value="MISTRAL">MISTRAL</option>
                    <option value="MISTRAL A">MISTRAL A</option>
                    <option value="MISTRAL B">MISTRAL B</option>
                    <option value="MISTRAL IS">MISTRAL IS</option>
                    <option value="MONTEVERDI B">MONTEVERDI B</option>
                    <option value="MONTEVERDI ESQUINERA II">
                      MONTEVERDI ESQUINERA II
                    </option>
                    <option value="MYKONOS">MYKONOS</option>
                    <option value="MYKONOS ESQUINERA 2">
                      MYKONOS ESQUINERA 2
                    </option>
                    <option value="NAPOLI A">NAPOLI A</option>
                    <option value="NAPOLI B">NAPOLI B</option>
                    <option value="NERO">NERO</option>
                    <option value="NERO B">NERO B</option>
                    <option value="NUEVA BORGHESE A">NUEVA BORGHESE A</option>
                    <option value="NUEVA BORGHESE B">NUEVA BORGHESE B</option>
                    <option value="NUEVA BORGHESE C">NUEVA BORGHESE C</option>
                    <option value="NUEVA BORGHESE D">NUEVA BORGHESE D</option>
                    <option value="OLIMPIA A">OLIMPIA A</option>
                    <option value="OLIMPIA B">OLIMPIA B</option>
                    <option value="OLIMPIA ESQ">OLIMPIA ESQ</option>
                    <option value="OLYMPIA">OLYMPIA</option>
                    <option value="OLYMPIA ESQUINERA">OLYMPIA ESQUINERA</option>
                    <option value="ORLEANS A">ORLEANS A</option>
                    <option value="ORSINI A">ORSINI A</option>
                    <option value="ORSINI C">ORSINI C</option>
                    <option value="ORSINI CON BALCON C">
                      ORSINI CON BALCON C
                    </option>
                    <option value="ORSINI CON BALCON D">
                      ORSINI CON BALCON D
                    </option>
                    <option value="ORSINI CON BALCON ESQUINERA">
                      ORSINI CON BALCON ESQUINERA
                    </option>
                    <option value="ORSINI D">ORSINI D</option>
                    <option value="ORSINI ESQUINERA">ORSINI ESQUINERA</option>
                    <option value="PISA A">PISA A</option>
                    <option value="PISA B">PISA B</option>
                    <option value="PISA C">PISA C</option>
                    <option value="PIZA">PIZA</option>
                    <option value="POR DEFINIRSE">POR DEFINIRSE</option>
                    <option value="PRADO">PRADO</option>
                    <option value="PRADO A">PRADO A</option>
                    <option value="PRADO A 114">PRADO A 114</option>
                    <option value="PRADO B">PRADO B</option>
                    <option value="PRADO B 114">PRADO B 114</option>
                    <option value="PROTOTIPO POR DEFINIRSE">
                      PROTOTIPO POR DEFINIRSE
                    </option>
                    <option value="PUCCINI ESQ">PUCCINI ESQ</option>
                    <option value="PUCCINI TIPO A">PUCCINI TIPO A</option>
                    <option value="PUCCINI TIPO B">PUCCINI TIPO B</option>
                    <option value="ROSSINI A">ROSSINI A</option>
                    <option value="ROSSINI ESQ">ROSSINI ESQ</option>
                    <option value="SABOYA">SABOYA</option>
                    <option value="SABOYA A">SABOYA A</option>
                    <option value="SABOYA A 103 M2">SABOYA A 103 M2</option>
                    <option value="SABOYA B">SABOYA B</option>
                    <option value="SABOYA C">SABOYA C</option>
                    <option value="SABOYA C/C">SABOYA C/C</option>
                    <option value="SABOYA D">SABOYA D</option>
                    <option value="SABOYA TIPO A">SABOYA TIPO A</option>
                    <option value="SAVOYA">SAVOYA</option>
                    <option value="SAVOYA A">SAVOYA A</option>
                    <option value="SAVOYA B">SAVOYA B</option>
                    <option value="SAVOYA TIPO A">SAVOYA TIPO A</option>
                    <option value="TERRENO">TERRENO</option>
                    <option value="TERRENO COM IS">TERRENO COM IS</option>
                    <option value="TORINO">TORINO</option>
                    <option value="TORINO A">TORINO A</option>
                    <option value="TORINO B">TORINO B</option>
                    <option value="VENECIA">VENECIA</option>
                    <option value="VENECIA A">VENECIA A</option>
                    <option value="VENECIA B">VENECIA B</option>
                    <option value="VENECIA C">VENECIA C</option>
                    <option value="VERDI ESQUINERA 2">VERDI ESQUINERA 2</option>
                    <option value="VERDI TIPO C">VERDI TIPO C</option>
                    <option value="VERSALLES A">VERSALLES A</option>
                    <option value="VERSALLES B">VERSALLES B</option>
                    <option value="VERSALLES C">VERSALLES C</option>
                    <option value="VERSALLES D">VERSALLES D</option>
                    <option value="VERSALLES ESQUINERA">
                      VERSALLES ESQUINERA
                    </option>
                    <option value="VERSALLES ESQUINERA 2">
                      VERSALLES ESQUINERA 2
                    </option>
                    <option value="VERSALLES F">VERSALLES F</option>
                    <option value="VERSALLES MOD A">VERSALLES MOD A</option>
                    <option value="VERSALLES MOD B">VERSALLES MOD B</option>
                    <option value="VERSALLES MOD. B">VERSALLES MOD. B</option>
                    <option value="VILLANOVA 2">VILLANOVA 2</option>
                    <option value="VILLANOVA 3">VILLANOVA 3</option>
                    <option value="VILLANOVA A">VILLANOVA A</option>
                    <option value="VILLANOVA B">VILLANOVA B</option>
                    <option value="VILLANOVA PLU">VILLANOVA PLU</option>
                    <option value="VILLANOVA PLU 64 A">
                      VILLANOVA PLU 64 A
                    </option>
                    <option value="VILLANOVA PLU 64 B">
                      VILLANOVA PLU 64 B
                    </option>
                    <option value="VILLANOVA PLU 73 A">
                      VILLANOVA PLU 73 A
                    </option>
                    <option value="VILLANOVA PLU 73 B">
                      VILLANOVA PLU 73 B
                    </option>
                    <option value="VILLANOVA UNI">VILLANOVA UNI</option>
                    <option value="VILLANOVA UNI 73">VILLANOVA UNI 73</option>
                    <option value="VILLANOVA UNI 73 A">
                      VILLANOVA UNI 73 A
                    </option>
                    <option value="VILLANOVA UNI 73 B">
                      VILLANOVA UNI 73 B
                    </option>
                    <option value="VILLANOVA UNI 73 C">
                      VILLANOVA UNI 73 C
                    </option>
                    <option value="VIOLA A">VIOLA A</option>
                    <option value="VIOLA C">VIOLA C</option>
                    <option value="VISCONTI">VISCONTI</option>
                    <option value="VISCONTI C">VISCONTI C</option>
                    <option value="VISCONTI D">VISCONTI D</option>
                    <option value="VISCONTI ESQUINERA 2">
                      VISCONTI ESQUINERA 2
                    </option>
                    <option value="VISCONTI ESQUINERA 3">
                      VISCONTI ESQUINERA 3
                    </option>
                    <option value="VISCONTI ESQUINERA 4">
                      VISCONTI ESQUINERA 4
                    </option>
                    <option value="VIVALDI">VIVALDI</option>
                    <option value="VIVALDI A 215 M2">VIVALDI A 215 M2</option>
                    <option value="VIVALDI A 217 M2">VIVALDI A 217 M2</option>
                    <option value="VIVALDI B 217 M2">VIVALDI B 217 M2</option>
                    <option value="POPOTLA TIPO C">POPOTLA TIPO C</option>
                    <option value="POPOTLA TIPO F">POPOTLA TIPO F</option>
                    <option value="LYON A ">LYON A </option>
                    <option value="CAPRI A">CAPRI A</option>
                    <option value="CAPRI B">CAPRI B</option>
                    <option value="CAPRI B">CAPRI B</option>
                    <option value="LUCCA B">LUCCA B</option>
                    <option value="FLORENTINO A">FLORENTINO A</option>
                    <option value="ORLEANS B">ORLEANS B</option>
                    <option value="MODENA B">MODENA B</option>
                    <option value="BORA B">BORA B</option>
                    <option value="CAPRI A">CAPRI A</option>
                    <option value="CAPRI B">CAPRI B</option>
                    <option value="MODENA A">MODENA A</option>
                    <option value="LYON A ">LYON A </option>
                    <option value="AMALIFI A">AMALIFI A</option>
                    <option value="LYON A ">LYON A </option>
                    <option value="BELLAGIO A">BELLAGIO A</option>
                    <option value="NERO A">NERO A</option>
                    <option value="FLORENTINO B 70">FLORENTINO B 70</option>
                    <option value="FLORENTINO A 70 ">FLORENTINO A 70 </option>
                    <option value="FLORENTINO A">FLORENTINO A</option>
                    <option value="SIENA A">SIENA A</option>
                    <option value="NIZA A">NIZA A</option>
                    <option value="NIZA B">NIZA B</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col className="col-sm-6">
                <FormGroup>
                  <Label htmlFor="prospecto">Sector</Label>
                  <Input
                    type="text"
                    placeholder="Sector"
                    onChange={this.handleChange}
                    id="email_2"
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col className="col-sm-4">
                <FormGroup>
                  <Label htmlFor="prospecto">Supermanzana</Label>
                  <Input
                    type="text"
                    placeholder="Supermanzana"
                    onChange={this.handleChange}
                    id="supermanzana"
                    value={this.state.supermanzana}
                    required
                  />
                </FormGroup>
              </Col>
              <Col className="col-sm-2">
                <FormGroup>
                  <Label htmlFor="prospecto">Manzana</Label>
                  <Input
                    type="text"
                    placeholder="Mz"
                    onChange={this.handleChange}
                    id="manzana"
                    required
                    value={this.state.manzana}
                  />
                </FormGroup>
              </Col>
              <Col className="col-sm-4">
                <FormGroup>
                  <Label htmlFor="prospecto">Lote</Label>
                  <Input
                    type="text"
                    placeholder="Lote"
                    onChange={this.handleChange}
                    id="lote"
                    required
                    value={this.state.lote}
                  />
                </FormGroup>
              </Col>
              <Col className="col-sm-2">
                <FormGroup>
                  <Label htmlFor="prospecto">Interior</Label>
                  <Input
                    type="text"
                    placeholder="Interior"
                    onChange={this.handleChange}
                    id="interior"
                    value={this.state.interior}
                    required
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col className="col-sm-6">
                <FormGroup>
                  <Label htmlFor="prospecto">Número de Cliente</Label>
                  <Input
                    type="text"
                    placeholder="No. Cliente"
                    onChange={this.handleChange}
                    id="no_cliente"
                    value={this.state.no_cliente}
                    required
                  />
                </FormGroup>
              </Col>
              <Col className="col-sm-6">
                <FormGroup>
                  <Label htmlFor="prospecto">Email</Label>
                  <Input
                    type="email"
                    placeholder="Email"
                    onChange={this.handleChange}
                    id="email"
                    value={this.state.email}
                    required
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col className="col-sm-4">
                <FormGroup>
                  <Label htmlFor="prospecto">Telefono 1</Label>
                  <Input
                    type="text"
                    pattern="[0-9]{10}"
                    placeholder="5555555555"
                    required
                    onChange={this.handleChange}
                    id="tel1"
                    value={this.state.tel1}
                  />
                </FormGroup>
              </Col>
              <Col className="col-sm-2">
                <FormGroup>
                  <Label htmlFor="prospecto">Extension</Label>
                  <Input
                    type="text"
                    placeholder="Ext"
                    onChange={this.handleChange}
                    id="ext1"
                    value={this.state.ext1}
                  />
                </FormGroup>
              </Col>
              <Col className="col-sm-4">
                <FormGroup>
                  <Label htmlFor="prospecto">Telefono 2</Label>
                  <Input
                    type="text"
                    pattern="[0-9]{10}"
                    placeholder="5555555555"
                    onChange={this.handleChange}
                    id="tel2"
                    value={this.state.tel2}
                  />
                </FormGroup>
              </Col>
              <Col className="col-sm-2">
                <FormGroup>
                  <Label htmlFor="prospecto">Extension</Label>
                  <Input
                    type="text"
                    placeholder="Ext"
                    onChange={this.handleChange}
                    id="ext2"
                    value={this.state.ext2}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col className="col-sm-6">
                <FormGroup>
                  <Label htmlFor="prospecto">Entrega Vivienda</Label>
                  <Input
                    type="date"
                    placeholder="Entrega Vivienda"
                    onChange={this.handleChange}
                    id="entrega_vivienda"
                    value={this.state.entrega_vivienda}
                  />
                </FormGroup>
              </Col>
              <Col className="col-sm-6">
                <FormGroup>
                  <Label htmlFor="prospecto">Entrega Escrituras</Label>
                  <Input
                    type="date"
                    placeholder="Entrega Escrituras"
                    onChange={this.handleChange}
                    id="entrega_escrituras"
                    value={this.state.entrega_escrituras}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <button type="submit" className="btn btn-primary">
                  Actualizar Contacto
                </button>
              </Col>
            </Row>
          </Form>
          <br />
          {this.props.function === "update" ? (
            <Form onSubmit={this.sendLlamadaSeguimiento}>
              <Row>
                <Col>
                  <FormGroup>
                    <Label htmlFor="prospecto">Historia del Caso</Label>
                    <Input
                      type="textarea"
                      placeholder="Descripcion"
                      id="descripcion"
                      readOnly
                      value={this.state.descripcion}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <ReactTabulator
                    ref={(ref) => (this.ref = ref)}
                    rowClick={this.rowClick}
                    index={"racsAsi"}
                    data={this.state.reportesRACS}
                    columns={columnsRACS}
                    tooltips={true}
                    layout={"fitColumns"}
                    options={options}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormGroup>
                    <Label htmlFor="prospecto">Seguimiento</Label>
                    <Input
                      type="textarea"
                      placeholder="Seguimiento"
                      onChange={this.handleChange}
                      id="seguimiento"
                      required
                      value={this.state.seguimiento}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <button type="submit" className="btn btn-primary">
                    Agregar Llamada Seguimiento
                  </button>
                </Col>
              </Row>
            </Form>
          ) : null}

          {this.props.function === "insert" ? (
            <div>
              <Form onSubmit={this.sendLlamadaSeguimiento}>
                <Row>
                  <Col className="col-sm-6">
                    <FormGroup>
                      <Label htmlFor="prospecto">
                        Nombre de quien hace la llamada
                      </Label>
                      <Input
                        type="text"
                        placeholder="Contacto"
                        required
                        onChange={this.handleChange}
                        id="contacto"
                        value={this.state.contacto}
                      />
                    </FormGroup>
                  </Col>
                  <Col className="col-sm-6">
                    <FormGroup>
                      <Label htmlFor="prospecto">
                        Relacion con el Interesado
                      </Label>
                      <Input
                        type="text"
                        placeholder="Relacion"
                        required
                        onChange={this.handleChange}
                        id="realacion"
                        value={this.state.relacion}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col className="col-sm-6">
                    <FormGroup>
                      <Label htmlFor="prospecto">Medio</Label>
                      <Input
                        type="select"
                        placeholder="Categoría"
                        required
                        onChange={this.handleChange}
                        id="medio"
                        value={this.state.medio}
                      >
                        <option value="">-Selecciona-</option>
                        <option>Telefonico</option>
                        <option>Email</option>
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col className="col-sm-6">
                    <FormGroup>
                      <Label htmlFor="prospecto">Tipo Reporte</Label>
                      <Input
                        type="select"
                        placeholder="Categoría"
                        required
                        onChange={this.handleChange}
                        id="tipo_reporte"
                        value={this.state.tipo_reporte}
                      >
                        <option value="">-Selecciona-</option>
                        <option>Normal</option>
                        <option>En Entrega</option>
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
              </Form>

              <Form
                className="form-horizontal"
                onSubmit={this.addReport}
                innerRef={this.formRef}
                autoComplete="off"
              >
                <Row>
                  <Col className="col-sm-4">
                    <FormGroup>
                      <Label htmlFor="prospecto">Tipo</Label>
                      <Select
                        options={tipo}
                        styles={customStyles}
                        isClearable={true}
                        placeholder={"-Selecciona-"}
                        theme={theme}
                        onChange={this.handleChangeTipo}
                        value={
                          this.state.tipo === ""
                            ? null
                            : {
                                label: this.state.tipo,
                                value: this.state.tipo,
                              }
                        }
                      />
                      <input
                        tabIndex={-1}
                        autoComplete="off"
                        style={{ opacity: 0, height: 0 }}
                        required
                        onChange={() => {}}
                        value={this.state.tipo}
                      />
                    </FormGroup>
                  </Col>
                  <Col className="col-sm-4">
                    <FormGroup>
                      <Label htmlFor="prospecto">Categoría</Label>
                      <Select
                        options={this.state.categorias}
                        styles={customStyles}
                        isClearable={true}
                        placeholder={"-Selecciona-"}
                        theme={theme}
                        onChange={this.handleChangeCategoria}
                        value={
                          this.state.categoria === ""
                            ? null
                            : {
                                label: this.state.categoria,
                                value: this.state.categoria,
                              }
                        }
                      />
                      <input
                        tabIndex={-1}
                        autoComplete="off"
                        style={{ opacity: 0, height: 0 }}
                        required
                        onChange={() => {}}
                        value={this.state.categoria}
                      />
                    </FormGroup>
                  </Col>

                  <Col className="col-sm-4">
                    <FormGroup>
                      <Label htmlFor="prospecto">Especificación</Label>
                      <Select
                        options={this.state.especificaciones}
                        styles={customStyles}
                        isClearable={true}
                        placeholder={"-Selecciona-"}
                        theme={theme}
                        onChange={this.handleChangeEspecificaciones}
                        value={
                          this.state.especificacion === ""
                            ? null
                            : {
                                label: this.state.especificacion,
                                value: this.state.especificacion,
                              }
                        }
                      />

                      <input
                        tabIndex={-1}
                        style={{ opacity: 0, height: 0 }}
                        onChange={(e) => {}}
                        value={this.state.especificacion}
                        required
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label htmlFor="prospecto">Detalle</Label>
                      <Input
                        type="textarea"
                        placeholder="Comentarios"
                        required
                        onChange={this.handleChange}
                        id="detalle"
                        value={this.state.detalle}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <button type="submit" className="btn btn-primary">
                      Agregar Reporte
                    </button>
                  </Col>
                </Row>
                <br />
              </Form>
              <Form onSubmit={this.handleGuardarRac}>
                <Row>
                  <Col>
                    <ReactTabulator
                      ref={(ref) => (this.ref = ref)}
                      rowClick={this.rowClick}
                      index={"racsAsi"}
                      data={this.state.reportesAgregados}
                      columns={columnsRACS}
                      tooltips={true}
                      layout={"fitColumns"}
                      options={options}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <button type="submit" className="btn btn-primary">
                      Guardar RAC
                    </button>
                  </Col>
                </Row>
              </Form>
            </div>
          ) : null}

          {this.props.function === "desarrollos" ? (
            <Form onSubmit={this.sendLlamadaSeguimiento}>
              <Row>
                <Col>
                  <FormGroup>
                    <Label htmlFor="prospecto">Historia del Caso</Label>
                    <Input
                      type="textarea"
                      placeholder="Descripcion"
                      id="descripcion"
                      readOnly
                      value={this.state.descripcion}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <ReactTabulator
                    ref={(ref) => (this.ref = ref)}
                    rowClick={this.rowClick}
                    index={"racsAsi"}
                    data={this.state.reportesRACS}
                    columns={columnsRACS}
                    tooltips={true}
                    layout={"fitColumns"}
                    options={options}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormGroup>
                    <Label htmlFor="prospecto">Seguimiento</Label>
                    <Input
                      type="textarea"
                      placeholder="Seguimiento"
                      onChange={this.handleChange}
                      id="seguimiento"
                      required
                      value={this.state.seguimiento}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col className="col-sm-4">
                  <button type="submit" className="btn btn-primary">
                    Actualizar RAC
                  </button>
                </Col>
                <Col className="col-sm-4">
                  <Input
                    type="select"
                    placeholder="Categoría"
                    required
                    onChange={this.handleChange}
                    id="estatusRAC"
                    value={this.state.estatusRAC}
                  >
                    <option value="">-Selecciona-</option>
                    <option>Pendiente</option>
                    <option>Cerrado Inconformidad</option>
                    <option>Cerrado</option>
                    <option>N/A Postventa</option>
                    <option>N/A Call Center</option>
                  </Input>
                </Col>
              </Row>
            </Form>
          ) : null}
        </div>
      );
    }
  }
}

export default withRouter(EditarRAC);
