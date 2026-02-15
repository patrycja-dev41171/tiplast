import nodemailer from "nodemailer";

export default defineEventHandler(async (event) => {
   const body = await readBody(event);

   const { order } = body;

   if (!order) {
      throw createError({
         statusCode: 400,
         statusMessage: "Brak wymaganych pól."
      });
   }

   const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
         user: process.env.SMTP_USER,
         pass: process.env.SMTP_PASS
      }
   });

   try {
      await transporter.sendMail({
         from: `"Tiplast.pl" <${process.env.SMTP_USER}>`,
         to: order.email,
         subject: `Dziękujemy za zamównienie: ${order.order_number}`,
         replyTo: process.env.SMTP_USER,
         html: `
   <tr>
      <td>
         <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;min-height:600px;margin:0 auto;background-color:#ffffff">
            <tbody>
               <tr>
                  <td style="vertical-align:top"></td>
               </tr>
               <tr>
                  <td style="vertical-align:top">
                     <table border="0" cellpadding="0" cellspacing="0" class="m_-2223041976175703093layout-0-under-200" align="center" style="display:none;border-spacing:0px;border-collapse:separate;width:100%;max-width:100%;table-layout:fixed;margin:0 auto;background-color:#edf0f2">
                        <tbody>
                           <tr>
                              <td style="text-align:center;padding:14.981613159179688px 20px">
                                 <table border="0" cellpadding="0" cellspacing="0" style="border-spacing:0px;border-collapse:separate;width:100%;max-width:200px;table-layout:fixed;margin:0 auto">
                                    <tbody>
                                       <tr>
                                          <td width="100.00%" style="width:100.00%;box-sizing:border-box;vertical-align:middle">
                                             <table border="0" cellpadding="0" cellspacing="0" style="border-spacing:0px;border-collapse:separate;width:100%;table-layout:fixed">
                                                <tbody>
                                                   <tr>
                                                      <td>
                                                         <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="color:#000;font-style:normal;font-weight:normal;font-size:16px;line-height:1.4;letter-spacing:0;text-align:left;direction:ltr;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;white-space:normal;word-wrap:break-word;word-break:break-word">
                                                            <tbody>
                                                               <tr>
                                                                  <td dir="ltr" style="color:#08040a;font-size:13.3334px;white-space:pre-wrap;line-height:0.89;text-align:left"><a href="http://trail.canva.com/CL0/http:%2F%2Ftiplast.pl/2/0100019b940f7861-29ddc0a1-ab4d-4c31-a24b-741e2120d79f-000000/4HgTtSiVTwr7rn4VkjrgITLQ2NvgXHB3Hq9c7WGCQEI=439" rel="noopener noreferrer" style="color:#08040a;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://trail.canva.com/CL0/http:%252F%252Ftiplast.pl/2/0100019b940f7861-29ddc0a1-ab4d-4c31-a24b-741e2120d79f-000000/4HgTtSiVTwr7rn4VkjrgITLQ2NvgXHB3Hq9c7WGCQEI%3D439&amp;source=gmail&amp;ust=1767802059473000&amp;usg=AOvVaw1f8xxnDNXryqwW431XlUff">tiplast.pl</a><br></td>
                                                               </tr>
                                                            </tbody>
                                                         </table>
                                                      </td>
                                                   </tr>
                                                </tbody>
                                             </table>
                                          </td>
                                       </tr>
                                       <tr>
                                          <td style="font-size:0;height:16px" height="16">&nbsp;</td>
                                       </tr>
                                       <tr>
                                          <td width="100.00%" style="width:100.00%;box-sizing:border-box;vertical-align:middle">
                                             <table border="0" cellpadding="0" cellspacing="0" style="border-spacing:0px;border-collapse:separate;width:100%;table-layout:fixed">
                                                <tbody>
                                                   <tr>
                                                      <td>
                                                         <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="color:#000;font-style:normal;font-weight:normal;font-size:16px;line-height:1.4;letter-spacing:0;text-align:left;direction:ltr;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;white-space:normal;word-wrap:break-word;word-break:break-word">
                                                            <tbody>
                                                               <tr>
                                                                  <td dir="ltr" style="font-size:13.3334px;white-space:pre-wrap;text-align:right"><a href="mailto:kontakt.tiplast@gmail.com" rel="noopener nofollow" style="color:inherit;text-decoration:inherit" target="_blank">kontakt.tiplast@gmail.com</a><br></td>
                                                               </tr>
                                                            </tbody>
                                                         </table>
                                                      </td>
                                                   </tr>
                                                </tbody>
                                             </table>
                                          </td>
                                       </tr>
                                    </tbody>
                                 </table>
                              </td>
                           </tr>
                        </tbody>
                     </table>
                  </td>
               </tr>
               <tr>
                  <td style="vertical-align:top;padding:0px 0px 10px 0px">
                     <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                        <tbody>
                           <tr>
                              <td style="padding:10px 0 10px 0;vertical-align:top">
                                 <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="color:#000;font-style:normal;font-weight:normal;font-size:16px;line-height:1.4;letter-spacing:0;text-align:left;direction:ltr;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;white-space:normal;word-wrap:break-word;word-break:break-word">
                                    <tbody>
                                       <tr>
                                          <td dir="ltr" style="color:#08040a;font-size:1.33509px;letter-spacing:-0.042em;font-family:Helvetica,Arial,sans-serif;white-space:pre-wrap;line-height:1.02;text-align:center;padding:0px 20px"><br></td>
                                       </tr>
                                       <tr>
                                          <td style="font-size:0;height:16px" height="16">&nbsp;</td>
                                       </tr>
                                       <tr>
                                          <td style="padding:0px 20px">
                                             <table cellpadding="0" cellspacing="0" border="0" style="width:100%">
                                                <tbody>
                                                   <tr>
                                                      <td align="center">
                                                         <table cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:276px">
                                                            <tbody>
                                                               <tr>
                                                                  <td style="width:100%;padding:20 0"><img src="https://ci3.googleusercontent.com/meips/ADKq_Nbcr4wrZgcH3HwP0RVgek5I9QkbEyAjc30NHibOjvQ0CDl4a8haZ5E3PzGvORn108WPVHF8yTvq9L426zkoc990ws-n4oSYLEPrdvTNZvsS-2pArwWx2lCWdgoZnm8aKPZ3yScxxYPTgGsVCyVag8hVBN3jw7txdeCJHpAe7g=s0-d-e1-ft#https://zwxmjgkxy3iroyzbaorwcqupghcx8owqnqvc4ldhh8e.canva-cdn.email/a36490018107acab6ae7eb2d55401357.png" width="276" height="61" style="display:block;width:100%;height:auto;max-width:100%" class="CToWUd" data-bit="iit"></td>
                                                               </tr>
                                                            </tbody>
                                                         </table>
                                                      </td>
                                                   </tr>
                                                </tbody>
                                             </table>
                                          </td>
                                       </tr>
                                       <tr>
                                          <td style="font-size:0;height:16px" height="16">&nbsp;</td>
                                       </tr>
                                       <tr>
                                          <td dir="ltr" style="font-size:18.6666px;font-family:Helvetica,Arial,sans-serif;line-height:1.5;text-align:center;padding:0px 20px"><span style="white-space:pre-wrap">Dziękujemy za twój zakup na</span><span style="white-space:pre-wrap"> </span><span style="font-weight:700;white-space:pre-wrap"><a href="http://trail.canva.com/CL0/http:%2F%2Ftiplast.pl/3/0100019b940f7861-29ddc0a1-ab4d-4c31-a24b-741e2120d79f-000000/RPIFzIV1ZsOQMPGwp6urTT9DMPL7JhZ-_w1RVegQULg=439" rel="noopener noreferrer" style="color:#000000;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://trail.canva.com/CL0/http:%252F%252Ftiplast.pl/3/0100019b940f7861-29ddc0a1-ab4d-4c31-a24b-741e2120d79f-000000/RPIFzIV1ZsOQMPGwp6urTT9DMPL7JhZ-_w1RVegQULg%3D439&amp;source=gmail&amp;ust=1767802059473000&amp;usg=AOvVaw3rdvizLFNuF_WDL-HKIZia">tiplast.pl</a></span><span style="font-weight:700;white-space:pre-wrap"><br></span></td>
                                       </tr>
                                       <tr>
                                          <td style="font-size:0;height:16px" height="16">&nbsp;</td>
                                       </tr>
                                       <tr>
                                          <td dir="ltr" style="font-size:16px;font-family:Helvetica,Arial,sans-serif;white-space:pre-wrap;line-height:1.5;text-align:center;padding:0px 20px">Twoje zamówienie oczekuje na zatwierdzenie.<br> Powiadomimy cię o zmianie jego statusu.</td>
                                       </tr>
                                       <tr>
                                          <td style="font-size:0;height:16px" height="16">&nbsp;</td>
                                       </tr>
                                       <tr>
                                          <td dir="ltr" style="font-size:16px;font-family:Helvetica,Arial,sans-serif;line-height:1.5;text-align:center;padding:0px 20px"><span style="white-space:pre-wrap">Link do zamówienia i statusu: </span><a href="https://tiplast.pl/zamowienie/${order.order_id}" rel="noopener nofollow" style="color:inherit;text-decoration:inherit" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://tiplast.pl/zamowienie/2024&amp;source=gmail&amp;ust=1767802059473000&amp;usg=AOvVaw2naSiTv_jRX7o1RyMgfhr1"><span style="text-decoration:underline;color:#1a62ff;white-space:pre-wrap">${order.order_number}</span></a><span style="white-space:pre-wrap"><br></span></td>
                                       </tr>
                                       <tr>
                                          <td style="font-size:0;height:16px" height="16">&nbsp;</td>
                                       </tr>
                                       <tr>
                                          <td dir="ltr" style="font-size:1.33349px;font-family:Helvetica,Arial,sans-serif;white-space:pre-wrap;line-height:1.5;text-align:center;padding:0px 20px"><br></td>
                                       </tr>
                                       <tr>
                                          <td style="font-size:0;height:16px" height="16">&nbsp;</td>
                                       </tr>
                                       <tr>
                                          <td style="padding:0px 20px">
                                             <table border="0" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;border-spacing:0px;table-layout:fixed;direction:ltr">
                                                <tbody>
                                                   <tr>
                                                      <td width="99.82142857142857%" style="width:99.82142857142857%;box-sizing:border-box;font-size:0">&nbsp;</td>
                                                   </tr>
                                                   <tr>
                                                      <td rowspan="1" colspan="1" width="100%" height="41" style="padding:20px;vertical-align:middle;box-sizing:border-box;width:100%;height:41px;border-top:1px solid #000000;border-bottom:1px solid #000000;border-left:1px solid #000000;border-right:1px solid #000000">
                                                         <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="color:#000;font-style:normal;font-weight:normal;font-size:16px;line-height:1.4;letter-spacing:0;text-align:left;direction:ltr;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;white-space:normal;word-wrap:break-word;word-break:break-word">
                                                            <tbody>
                                                               <tr>
                                                                  <td dir="ltr" style="font-size:16px;font-family:Helvetica,Arial,sans-serif;line-height:1.64;text-align:center"><span style="font-size:13.3334px;letter-spacing:0.078em;white-space:pre-wrap">Numer twojego zamówienia</span><span style="font-size:13.3334px;letter-spacing:0.078em;white-space:pre-wrap">:</span><span style="font-size:13.3334px;white-space:pre-wrap"><br></span><span style="font-size:21.3332px;font-weight:700;white-space:pre-wrap">${order.order_number}</span><span style="font-size:21.3332px;font-weight:700;white-space:pre-wrap"><br></span></td>
                                                               </tr>
                                                            </tbody>
                                                         </table>
                                                      </td>
                                                   </tr>
                                                </tbody>
                                             </table>
                                          </td>
                                       </tr>
                                       <tr>
                                          <td style="font-size:0;height:16px" height="16">&nbsp;</td>
                                       </tr>
                                       <tr>
                                          <td style="padding:0px 20px">
                                             <table cellpadding="0" cellspacing="0" border="0" style="width:100%">
                                                <tbody>
                                                   <tr>
                                                      <td align="center">
                                                         <table cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px">
                                                            <tbody>
                                                               <tr>
                                                                  <td height="1px" style="height:1px;border-radius:999px;line-height:1px;font-size:0;background-color:#bfc3c8">&nbsp;</td>
                                                               </tr>
                                                            </tbody>
                                                         </table>
                                                      </td>
                                                   </tr>
                                                </tbody>
                                             </table>
                                          </td>
                                       </tr>
                                       <tr>
                                          <td style="font-size:0;height:16px" height="16">&nbsp;</td>
                                       </tr>
                                       <tr>
                                          <td style="padding:0px 20px">
                                             <table border="0" cellpadding="0" cellspacing="0" class="m_-2223041976175703093layout-1" align="center" style="display:table;border-spacing:0px;border-collapse:separate;width:100%;max-width:100%;table-layout:fixed;margin:0 auto">
                                                <tbody>
                                                   <tr>
                                                      <td style="text-align:center">
                                                         <table border="0" cellpadding="0" cellspacing="0" style="border-spacing:0px;border-collapse:separate;width:100%;max-width:560px;table-layout:fixed;margin:0 auto">
                                                            <tbody>
                                                               <tr>
                                                                  <td width="25.33%" style="width:25.33%;box-sizing:border-box;vertical-align:top">
                                                                     <table border="0" cellpadding="0" cellspacing="0" style="border-spacing:0px;border-collapse:separate;width:100%;table-layout:fixed">
                                                                        <tbody>
                                                                           <tr>
                                                                              <td>
                                                                                 <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="color:#000;font-style:normal;font-weight:normal;font-size:16px;line-height:1.4;letter-spacing:0;text-align:left;direction:ltr;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;white-space:normal;word-wrap:break-word;word-break:break-word">
                                                                                    <tbody>
                                                                                       <tr>
                                                                                          <td>
                                                                                             <table cellpadding="0" cellspacing="0" border="0" style="width:100%">
                                                                                                <tbody>
                                                                                                   <tr>
                                                                                                      <td align="center">
                                                                                                         <table cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:142px">
                                                                                                            <tbody>
                                                                                                               <tr>
                                                                                                                  <td style="width:100%;padding:0"><img src="https://ci3.googleusercontent.com/meips/ADKq_Nb3XnWzi3LmfwE2ebKyCXZg5WdqmoP4CYHTiAhWehmvXLxYb6rdTo92rtekiyZZOgXuimyIlFx2ujRX2PtlT-re5sZDxmLh1vxAmB175m9oSrDeTqUn2pd1XomlojzHQbddErVnhd2mAS0YPbDhKZghVus1vORmgMZVYwrcZA=s0-d-e1-ft#https://zwxmjgkxy3iroyzbaorwcqupghcx8owqnqvc4ldhh8e.canva-cdn.email/a241ebc570d518acfc7624cade5d142a.png" width="142" height="31" style="display:block;width:100%;height:auto;max-width:100%" class="CToWUd" data-bit="iit"></td>
                                                                                                               </tr>
                                                                                                            </tbody>
                                                                                                         </table>
                                                                                                      </td>
                                                                                                   </tr>
                                                                                                </tbody>
                                                                                             </table>
                                                                                          </td>
                                                                                       </tr>
                                                                                    </tbody>
                                                                                 </table>
                                                                              </td>
                                                                           </tr>
                                                                        </tbody>
                                                                     </table>
                                                                  </td>
                                                                  <td width="20" style="width:20px;box-sizing:border-box;font-size:0">&nbsp;</td>
                                                                  <td width="9.29%" style="width:9.29%;box-sizing:border-box;vertical-align:top">
                                                                     <table border="0" cellpadding="0" cellspacing="0" style="border-spacing:0px;border-collapse:separate;width:100%;table-layout:fixed">
                                                                        <tbody>
                                                                           <tr>
                                                                              <td>
                                                                                 <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="color:#000;font-style:normal;font-weight:normal;font-size:16px;line-height:1.4;letter-spacing:0;text-align:left;direction:ltr;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;white-space:normal;word-wrap:break-word;word-break:break-word">
                                                                                    <tbody>
                                                                                       <tr>
                                                                                          <td dir="ltr" style="font-size:13.3334px;text-decoration:underline;letter-spacing:-0.025em;font-family:Helvetica,Arial,sans-serif;white-space:pre-wrap;text-align:left"><br></td>
                                                                                       </tr>
                                                                                    </tbody>
                                                                                 </table>
                                                                              </td>
                                                                           </tr>
                                                                        </tbody>
                                                                     </table>
                                                                  </td>
                                                                  <td width="20" style="width:20px;box-sizing:border-box;font-size:0">&nbsp;</td>
                                                                  <td width="58.24%" style="width:58.24%;box-sizing:border-box;vertical-align:bottom">
                                                                     <table border="0" cellpadding="0" cellspacing="0" style="border-spacing:0px;border-collapse:separate;width:100%;table-layout:fixed">
                                                                        <tbody>
                                                                           <tr>
                                                                              <td>
                                                                                 <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="color:#000;font-style:normal;font-weight:normal;font-size:16px;line-height:1.4;letter-spacing:0;text-align:left;direction:ltr;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;white-space:normal;word-wrap:break-word;word-break:break-word">
                                                                                    <tbody>
                                                                                       <tr>
                                                                                          <td dir="ltr" style="font-size:16px;font-family:Helvetica,Arial,sans-serif;line-height:1.2;text-align:left"><span style="font-size:12px;font-weight:700;letter-spacing:0.04em;color:#212121;white-space:pre-wrap">Tiplast Iński Tomasz</span><span style="font-size:12px;letter-spacing:0.04em;color:#212121;white-space:pre-wrap"><br>31, 86-221 Papowo Biskupie, woj. kujawsko-pomorskie, Polska<br>NIP: <a href="http://trail.canva.com/CL0/tel:5621212221/1/0100019b940f7861-29ddc0a1-ab4d-4c31-a24b-741e2120d79f-000000/h5bkX2d8nS3YXn-bHURuoorWo96NPt-Ap-tBAbCWRyk=439" rel="noopener noreferrer" style="color:#212121;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://trail.canva.com/CL0/tel:5621212221/1/0100019b940f7861-29ddc0a1-ab4d-4c31-a24b-741e2120d79f-000000/h5bkX2d8nS3YXn-bHURuoorWo96NPt-Ap-tBAbCWRyk%3D439&amp;source=gmail&amp;ust=1767802059474000&amp;usg=AOvVaw211zbieHxUjOrcM1MTzM0l">5621212221</a> • REGON: <a href="http://trail.canva.com/CL0/tel:361058296/1/0100019b940f7861-29ddc0a1-ab4d-4c31-a24b-741e2120d79f-000000/xbaIS_ExQZ5uQGzJiurVxjaMqpvvkhNQ85XiS9wadME=439" rel="noopener noreferrer" style="color:#212121;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://trail.canva.com/CL0/tel:361058296/1/0100019b940f7861-29ddc0a1-ab4d-4c31-a24b-741e2120d79f-000000/xbaIS_ExQZ5uQGzJiurVxjaMqpvvkhNQ85XiS9wadME%3D439&amp;source=gmail&amp;ust=1767802059474000&amp;usg=AOvVaw0ZMY-iJoe7EXVf8LQC8qa7">361058296</a><br>E-mail: </span><span style="font-size:12px;text-decoration:underline;letter-spacing:0.04em;color:#1a62ff;white-space:pre-wrap"><a href="mailto:kontakt.tiplast@gmail.com" rel="noopener noreferrer" style="color:#1a62ff;text-decoration:underline" target="_blank">kontakt.tiplast@gmail.com</a><br></span><span style="font-size:12px;letter-spacing:0.04em;color:#212121;white-space:pre-wrap">Tel.: <a href="http://trail.canva.com/CL0/tel:%2B48608467068/1/0100019b940f7861-29ddc0a1-ab4d-4c31-a24b-741e2120d79f-000000/pGX_ImjWLwwN7YNf7k0MwGcsegtxG_qCSHBpaamG4Ac=439" rel="noopener noreferrer" style="color:#212121;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://trail.canva.com/CL0/tel:%252B48608467068/1/0100019b940f7861-29ddc0a1-ab4d-4c31-a24b-741e2120d79f-000000/pGX_ImjWLwwN7YNf7k0MwGcsegtxG_qCSHBpaamG4Ac%3D439&amp;source=gmail&amp;ust=1767802059474000&amp;usg=AOvVaw136M-leRGjZhXKp2UjGUj9">+48 608 467 068</a></span><span style="font-size:13.3334px;font-weight:700;letter-spacing:-0.025em;white-space:pre-wrap"><br></span><span style="font-size:13.3334px;font-weight:700;letter-spacing:-0.025em;white-space:pre-wrap"><br></span></td>
                                                                                       </tr>
                                                                                    </tbody>
                                                                                 </table>
                                                                              </td>
                                                                           </tr>
                                                                        </tbody>
                                                                     </table>
                                                                  </td>
                                                               </tr>
                                                            </tbody>
                                                         </table>
                                                      </td>
                                                   </tr>
                                                </tbody>
                                             </table>
                                             <table border="0" cellpadding="0" cellspacing="0" class="m_-2223041976175703093layout-1-under-1" align="center" style="display:none;border-spacing:0px;border-collapse:separate;width:100%;max-width:100%;table-layout:fixed;margin:0 auto">
                                                <tbody>
                                                   <tr>
                                                      <td style="text-align:center">
                                                         <table border="0" cellpadding="0" cellspacing="0" style="border-spacing:0px;border-collapse:separate;width:100%;max-width:1px;table-layout:fixed;margin:0 auto">
                                                            <tbody>
                                                               <tr>
                                                                  <td width="100.00%" style="width:100.00%;box-sizing:border-box;vertical-align:top">
                                                                     <table border="0" cellpadding="0" cellspacing="0" style="border-spacing:0px;border-collapse:separate;width:100%;table-layout:fixed">
                                                                        <tbody>
                                                                           <tr>
                                                                              <td>
                                                                                 <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="color:#000;font-style:normal;font-weight:normal;font-size:16px;line-height:1.4;letter-spacing:0;text-align:left;direction:ltr;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;white-space:normal;word-wrap:break-word;word-break:break-word">
                                                                                    <tbody>
                                                                                       <tr>
                                                                                          <td>
                                                                                             <table cellpadding="0" cellspacing="0" border="0" style="width:100%">
                                                                                                <tbody>
                                                                                                   <tr>
                                                                                                      <td align="center">
                                                                                                         <table cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:1px">
                                                                                                            <tbody>
                                                                                                               <tr>
                                                                                                                  <td style="width:100%;padding:0"><img src="https://ci3.googleusercontent.com/meips/ADKq_Nb3XnWzi3LmfwE2ebKyCXZg5WdqmoP4CYHTiAhWehmvXLxYb6rdTo92rtekiyZZOgXuimyIlFx2ujRX2PtlT-re5sZDxmLh1vxAmB175m9oSrDeTqUn2pd1XomlojzHQbddErVnhd2mAS0YPbDhKZghVus1vORmgMZVYwrcZA=s0-d-e1-ft#https://zwxmjgkxy3iroyzbaorwcqupghcx8owqnqvc4ldhh8e.canva-cdn.email/a241ebc570d518acfc7624cade5d142a.png" width="1" height="0" style="display:block;width:100%;height:auto;max-width:100%" class="CToWUd" data-bit="iit"></td>
                                                                                                               </tr>
                                                                                                            </tbody>
                                                                                                         </table>
                                                                                                      </td>
                                                                                                   </tr>
                                                                                                </tbody>
                                                                                             </table>
                                                                                          </td>
                                                                                       </tr>
                                                                                    </tbody>
                                                                                 </table>
                                                                              </td>
                                                                           </tr>
                                                                        </tbody>
                                                                     </table>
                                                                  </td>
                                                               </tr>
                                                               <tr>
                                                                  <td width="100.00%" style="width:100.00%;box-sizing:border-box;vertical-align:bottom">
                                                                     <table border="0" cellpadding="0" cellspacing="0" style="border-spacing:0px;border-collapse:separate;width:100%;table-layout:fixed">
                                                                        <tbody>
                                                                           <tr>
                                                                              <td>
                                                                                 <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="color:#000;font-style:normal;font-weight:normal;font-size:16px;line-height:1.4;letter-spacing:0;text-align:left;direction:ltr;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;white-space:normal;word-wrap:break-word;word-break:break-word">
                                                                                    <tbody>
                                                                                       <tr>
                                                                                          <td dir="ltr" style="font-size:16px;font-family:Helvetica,Arial,sans-serif;line-height:1.2;text-align:left"><span style="font-size:12px;font-weight:700;letter-spacing:0.04em;color:#212121;white-space:pre-wrap">Tiplast Iński Tomasz</span><span style="font-size:12px;letter-spacing:0.04em;color:#212121;white-space:pre-wrap"><br>31, 86-221 Papowo Biskupie, woj. kujawsko-pomorskie, Polska<br>NIP: <a href="http://trail.canva.com/CL0/tel:5621212221/2/0100019b940f7861-29ddc0a1-ab4d-4c31-a24b-741e2120d79f-000000/J7ZYL3OrBFLnYfUgGmAqt7QADWvQFeSvL9PoRc2a-MY=439" rel="noopener noreferrer" style="color:#212121;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://trail.canva.com/CL0/tel:5621212221/2/0100019b940f7861-29ddc0a1-ab4d-4c31-a24b-741e2120d79f-000000/J7ZYL3OrBFLnYfUgGmAqt7QADWvQFeSvL9PoRc2a-MY%3D439&amp;source=gmail&amp;ust=1767802059474000&amp;usg=AOvVaw1xmWmUmadJDnUPQzFgLkS1">5621212221</a> • REGON: <a href="http://trail.canva.com/CL0/tel:361058296/2/0100019b940f7861-29ddc0a1-ab4d-4c31-a24b-741e2120d79f-000000/EtjTmX336t6YQd1cUoOUZD4nOVkkvJWzFjXK8Us1uG0=439" rel="noopener noreferrer" style="color:#212121;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://trail.canva.com/CL0/tel:361058296/2/0100019b940f7861-29ddc0a1-ab4d-4c31-a24b-741e2120d79f-000000/EtjTmX336t6YQd1cUoOUZD4nOVkkvJWzFjXK8Us1uG0%3D439&amp;source=gmail&amp;ust=1767802059474000&amp;usg=AOvVaw2cnEudUYKaI7GX2Ihybctr">361058296</a><br>E-mail: </span><span style="font-size:12px;text-decoration:underline;letter-spacing:0.04em;color:#1a62ff;white-space:pre-wrap"><a href="mailto:kontakt.tiplast@gmail.com" rel="noopener noreferrer" style="color:#1a62ff;text-decoration:underline" target="_blank">kontakt.tiplast@gmail.com</a><br></span><span style="font-size:12px;letter-spacing:0.04em;color:#212121;white-space:pre-wrap">Tel.: <a href="http://trail.canva.com/CL0/tel:%2B48608467068/2/0100019b940f7861-29ddc0a1-ab4d-4c31-a24b-741e2120d79f-000000/EAiM5i8vbD9kGGQ8TWxA88eClXAi6NyUyzxJrTJPZIY=439" rel="noopener noreferrer" style="color:#212121;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://trail.canva.com/CL0/tel:%252B48608467068/2/0100019b940f7861-29ddc0a1-ab4d-4c31-a24b-741e2120d79f-000000/EAiM5i8vbD9kGGQ8TWxA88eClXAi6NyUyzxJrTJPZIY%3D439&amp;source=gmail&amp;ust=1767802059474000&amp;usg=AOvVaw2h-r2HyMRRVDDLSpwuiVl7">+48 608 467 068</a></span><span style="font-size:13.3334px;font-weight:700;letter-spacing:-0.025em;white-space:pre-wrap"><br></span><span style="font-size:13.3334px;font-weight:700;letter-spacing:-0.025em;white-space:pre-wrap"><br></span></td>
                                                                                       </tr>
                                                                                    </tbody>
                                                                                 </table>
                                                                              </td>
                                                                           </tr>
                                                                        </tbody>
                                                                     </table>
                                                                  </td>
                                                               </tr>
                                                            </tbody>
                                                         </table>
                                                      </td>
                                                   </tr>
                                                </tbody>
                                             </table>
                                          </td>
                                       </tr>
                                       <tr>
                                          <td style="font-size:0;height:16px" height="16">&nbsp;</td>
                                       </tr>
                                       <tr>
                                          <td dir="ltr" style="font-size:10.6668px;font-family:Helvetica,Arial,sans-serif;white-space:pre-wrap;text-align:left;padding:0px 20px">RODO/GDPR: Administratorem danych jest Tiplast Iński Tomasz. Dane przetwarzamy w celu prowadzenia korespondencji i obsługi spraw (art. 6 ust. 1 lit. b/f RODO). Szczegóły: <a href="http://trail.canva.com/CL0/http:%2F%2Ftiplast.pl/4/0100019b940f7861-29ddc0a1-ab4d-4c31-a24b-741e2120d79f-000000/f_yBxJnaDCaafnuo9mV__12VZtQ4GZQgbdMHL9CA4pE=439" rel="noopener noreferrer" style="color:#000000;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://trail.canva.com/CL0/http:%252F%252Ftiplast.pl/4/0100019b940f7861-29ddc0a1-ab4d-4c31-a24b-741e2120d79f-000000/f_yBxJnaDCaafnuo9mV__12VZtQ4GZQgbdMHL9CA4pE%3D439&amp;source=gmail&amp;ust=1767802059474000&amp;usg=AOvVaw3x792o6gjqt1yL92VwMptI">tiplast.pl</a>.<br></td>
                                       </tr>
                                    </tbody>
                                 </table>
                              </td>
                           </tr>
                        </tbody>
                     </table>
                  </td>
               </tr>
               <tr>
                  <td height="100%" style="height:100%;font-size:0;line-height:0" aria-hidden="true">&nbsp;</td>
               </tr>
            </tbody>
         </table>
      </td>
   </tr>`
      });

      return { ok: true };
   } catch (err) {
      console.error("Błąd wysyłki e-maila:", err);
      throw createError({
         statusCode: 500,
         statusMessage: "Nie udało się wysłać wiadomości."
      });
   }
});
