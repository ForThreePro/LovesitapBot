import { exec } from "child_process"

let handler = async (m, { conn, command }) => {

    // 1. RESET
    if (command === 'reset') {
        await m.react('🔄')
        await m.reply(`🍰 *𝗟𝗢𝗩𝗘𝗦𝗜𝗧𝗔𝗣 𝗕𝗢𝗧 - 𝗥𝗘𝗦𝗘𝗧* 🌸

.⃟𖥔 ݁. 𖦹˙— \`\`REINICIANDO\`\` —˙𖦹.🍜꒷

*━━━━━━━━━━*
*🔄 REINICIANDO SISTEMA*

> _Por favor espera unos segundos..._

*━━━━━━━━━━*`)
        process.send('reset')
    }

    // 2. AUTOADMIN
    if (command === 'autoadmin') {
        try {
            await m.react('👑')
            await conn.groupParticipantsUpdate(m.chat, [conn.user.jid], 'promote')
            await m.reply(`🍰 *𝗟𝗢𝗩𝗘𝗦𝗜𝗧𝗔𝗣 𝗕𝗢𝗧 - 𝗔𝗗𝗠𝗜𝗡* 🌸

.⃟𖥔 ݁. 𖦹˙— \`\`PODERES ASIGNADOS\`\` —˙𖦹.🍜꒷

*━━━━━━━━━━*
*✅ ADMINISTRADOR ASIGNADO*

*➤* Ya tengo poderes de *admin* en este grupo 🍜

*━━━━━━━━━━*`)
        } catch (e) {
            await m.react('❌')
            m.reply(`🍰 *𝗟𝗢𝗩𝗘𝗦𝗜𝗧𝗔𝗣 𝗕𝗢𝗧* 🌸

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` —˙𖦹.🍜꒷

*━━━━━━━━━━*
*❌ ERROR*

*➤* No pude asignarme *admin*
*➤* Revisa que ya no sea admin o que tengas permisos

*━━━━━━━━━━*`)
        }
    }

    // 3. UPDATE / ACTUALIZAR / FIX
    if (command === 'update' || command === 'actualizar' || command === 'fix') {
        if (m.react) await m.react('🌀')

        await conn.reply(m.chat, `🍰 *𝗟𝗢𝗩𝗘𝗦𝗜𝗧𝗔𝗣 𝗕𝗢𝗧 - 𝗨𝗣𝗗𝗔𝗧𝗘* 🌸

.⃟𖥔 ݁. 𖦹˙— \`\`ACTUALIZANDO\`\` —˙𖦹.🍜꒷

*━━━━━━━━━━*
*🌀 ACTUALIZANDO MODULOS*

> _Obteniendo cambios del repositorio..._

*━━━━━━━━━━*`, m)

        exec('git pull', async (err, stdout, stderr) => {
            if (err) {
                if (m.react) await m.react('❌')
                return conn.reply(m.chat, `🍰 *𝗟𝗢𝗩𝗘𝗦𝗜𝗧𝗔𝗣 𝗕𝗢𝗧* 🌸

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` —˙𖦹.🍜꒷

*━━━━━━━━━━*
*❌ ERROR EN LA ACTUALIZACION*

*➤* Detalle: 
\`\`${err.message}\`\`

*━━━━━━━━━━*`, m)
            }

            if (stdout.includes('Already up to date.')) {
                if (m.react) await m.react('✅')
                return conn.reply(m.chat, `🍰 *𝗟𝗢𝗩𝗘𝗦𝗜𝗧𝗔𝗣 𝗕𝗢𝗧* 🌸

.⃟𖥔 ݁. 𖦹˙— \`\`ACTUALIZADO\`\` —˙𖦹.🍜꒷

*━━━━━━━━━━*
*✅ SISTEMA ACTUALIZADO*

*➤* El sistema ya está en su *versión más reciente*

*━━━━━━━━━━*`, m)
            }

            if (m.react) await m.react('✅')
            return conn.reply(m.chat, `🍰 *𝗟𝗢𝗩𝗘𝗦𝗜𝗧𝗔𝗣 𝗕𝗢𝗧* 🌸

.⃟𖥔 ݁. 𖦹˙— \`\`CAMBIOS APLICADOS\`\` —˙𖦹.🍜꒷

*━━━━━━━━━━*
*✅ ACTUALIZACION APLICADA*

*📋 Cambios:*
\`\`${stdout}\`\`

*━━━━━━━━━━*`, m)
        })
    }
}

handler.help = ['reset', 'autoadmin', 'update']
handler.tags = ['owner']
handler.command = ['reset', 'autoadmin', 'update', 'actualizar', 'fix']
handler.rowner = true

export default handler